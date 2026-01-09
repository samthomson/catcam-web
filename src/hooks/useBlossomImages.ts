import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { nip19 } from 'nostr-tools';
import type { NostrEvent } from '@nostrify/nostrify';

interface ImageFromNote {
  url: string;
  noteId: string;
  content: string;
  createdAt: number;
  event: NostrEvent;
}

/**
 * Hook to fetch images from user's kind 1 notes
 * Extracts image URLs from note content
 * @param npub - The npub to fetch notes for
 */
export function useBlossomImages(npub: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['user-images', npub],
    queryFn: async (c) => {
      // Decode the npub to get the pubkey
      const decoded = nip19.decode(npub);
      if (decoded.type !== 'npub') {
        throw new Error('Invalid npub provided');
      }
      const pubkey = decoded.data;

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(10000)]);

      // Fetch kind 1 (Short Text Note) events from the user
      const events = await nostr.query(
        [
          {
            kinds: [1],
            authors: [pubkey],
            limit: 500,
          },
        ],
        { signal }
      );

      // Extract all image URLs from the notes
      const imageUrlPattern = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?[^\s]*)?/gi;

      const images: ImageFromNote[] = [];

      for (const event of events) {
        const matches = event.content.match(imageUrlPattern);
        if (matches) {
          for (const url of matches) {
            images.push({
              url: url.trim(),
              noteId: event.id,
              content: event.content,
              createdAt: event.created_at,
              event,
            });
          }
        }
      }

      // Sort by creation date, newest first
      return images.sort((a, b) => b.createdAt - a.createdAt);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
