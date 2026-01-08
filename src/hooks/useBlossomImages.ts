import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';

interface BlossomImage {
  url: string;
  sha256: string;
  size: number;
  type: string;
  uploaded: number;
  width?: number;
  height?: number;
}

interface BlossomListResponse {
  sha256: string;
  size: number;
  type: string;
  uploaded: number;
  url?: string;
  width?: number;
  height?: number;
}

/**
 * Hook to fetch all Blossom images for a given npub
 * Fetches directly from Blossom server HTTP API
 * @param npub - The npub to fetch images for
 * @param blossomServer - Blossom server URL (default: https://bs.samt.st)
 */
export function useBlossomImages(npub: string, blossomServer: string = 'https://bs.samt.st') {
  return useQuery({
    queryKey: ['blossom-images', npub, blossomServer],
    queryFn: async ({ signal }) => {
      // Decode the npub to get the pubkey
      const decoded = nip19.decode(npub);
      if (decoded.type !== 'npub') {
        throw new Error('Invalid npub provided');
      }
      const pubkey = decoded.data;

      // Fetch from Blossom server's list endpoint
      // BUD-04: GET /{pubkey}/list - List all blobs uploaded by a pubkey
      const url = `${blossomServer}/${pubkey}/list`;

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`Failed to fetch from Blossom server: ${response.statusText}`);
      }

      const blobs: BlossomListResponse[] = await response.json();

      // Filter for images only and transform to our format
      const images: BlossomImage[] = blobs
        .filter((blob) => blob.type.startsWith('image/'))
        .map((blob) => ({
          url: blob.url || `${blossomServer}/${blob.sha256}`,
          sha256: blob.sha256,
          size: blob.size,
          type: blob.type,
          uploaded: blob.uploaded,
          width: blob.width,
          height: blob.height,
        }))
        // Sort by upload date, newest first
        .sort((a, b) => b.uploaded - a.uploaded);

      return images;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
