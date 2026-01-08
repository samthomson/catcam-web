import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { nip19 } from 'nostr-tools';
import type { NostrEvent } from '@nostrify/nostrify';

interface BlossomImage {
  url: string;
  hash: string;
  mimeType?: string;
  size?: string;
  dimensions?: string;
  blurhash?: string;
  description?: string;
  createdAt: number;
  event: NostrEvent;
}

/**
 * Hook to fetch all Blossom images (kind 1063) for a given npub
 * @param npub - The npub to fetch images for
 * @param blossomRelay - Optional specific Blossom relay to query
 */
export function useBlossomImages(npub: string, blossomRelay?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['blossom-images', npub, blossomRelay],
    queryFn: async (c) => {
      // Decode the npub to get the pubkey
      const decoded = nip19.decode(npub);
      if (decoded.type !== 'npub') {
        throw new Error('Invalid npub provided');
      }
      const pubkey = decoded.data;

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(15000)]);

      // Query the specific relay if provided, otherwise use default pool
      const querySource = blossomRelay ? nostr.relay(blossomRelay) : nostr;

      // Fetch kind 1063 (File Metadata) events from the user
      const events = await querySource.query(
        [
          {
            kinds: [1063],
            authors: [pubkey],
            limit: 500,
          },
        ],
        { signal }
      );

      // Transform events into BlossomImage objects
      const images: BlossomImage[] = events
        .map((event) => {
          const url = event.tags.find(([name]) => name === 'url')?.[1];
          const hash = event.tags.find(([name]) => name === 'x')?.[1];
          const mimeType = event.tags.find(([name]) => name === 'm')?.[1];
          const size = event.tags.find(([name]) => name === 'size')?.[1];
          const dimensions = event.tags.find(([name]) => name === 'dim')?.[1];
          const blurhash = event.tags.find(([name]) => name === 'blurhash')?.[1];

          // Only include events that have a valid URL and hash (required fields)
          if (!url || !hash) {
            return null;
          }

          // Filter for image MIME types only
          if (mimeType && !mimeType.startsWith('image/')) {
            return null;
          }

          return {
            url,
            hash,
            mimeType,
            size,
            dimensions,
            blurhash,
            description: event.content,
            createdAt: event.created_at,
            event,
          };
        })
        .filter((img): img is BlossomImage => img !== null)
        // Sort by creation date, newest first
        .sort((a, b) => b.createdAt - a.createdAt);

      return images;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
