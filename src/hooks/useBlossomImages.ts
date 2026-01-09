import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
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
 * Hard-coded to relay.samt.st and specific pubkey
 */
export function useBlossomImages() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['user-images'],
    queryFn: async (c) => {
      // Hard-coded pubkey
      const pubkey = '23168823f2f310372b8a45810608a8947802dd956c07213bc43c6d6b81d64289';

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(10000)]);

      // Connect to specific relay
      const relay = nostr.relay('wss://relay.samt.st');

      // Fetch kind 1 (Short Text Note) events from the user
      const events = await relay.query(
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
