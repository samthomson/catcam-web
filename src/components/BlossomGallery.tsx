import { useState, useMemo } from 'react';
import { nip19 } from 'nostr-tools';
import { useBlossomImages } from '@/hooks/useBlossomImages';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageModal } from '@/components/ImageModal';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlossomGalleryProps {
  npub: string;
}

export function BlossomGallery({ npub }: BlossomGalleryProps) {
  // Try without specific relay first - use the default relay pool
  const { data: images, isLoading, error } = useBlossomImages(npub);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Decode npub to get pubkey for author info
  const pubkey = useMemo(() => {
    try {
      const decoded = nip19.decode(npub);
      return decoded.type === 'npub' ? decoded.data : '';
    } catch {
      return '';
    }
  }, [npub]);

  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name || metadata?.display_name || genUserName(pubkey);
  const profileImage = metadata?.picture;

  if (error) {
    return (
      <div className="col-span-full">
        <Card className="border-dashed border-red-200 dark:border-red-800">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Failed to Load Images
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error instanceof Error ? error.message : 'An error occurred while fetching images from the Blossom relay.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        {/* Profile Skeleton */}
        <div className="mb-8">
          <Card className="border-purple-200/50 dark:border-purple-700/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-purple-200/50 dark:border-purple-700/30">
              <Skeleton className="aspect-square w-full" />
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="col-span-full">
        <Card className="border-dashed border-purple-200 dark:border-purple-700">
          <CardContent className="py-16 px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center w-24 h-24">
                  <svg className="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Images Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This user hasn't uploaded any images to Blossom servers yet, or their images are stored on relays we're not currently querying.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 text-sm text-left space-y-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">💡 Try a different user:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add <code className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-purple-700 dark:text-purple-300">?npub=YOUR_NPUB_HERE</code> to the URL
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    Example: <code className="bg-purple-100 dark:bg-purple-900/30 px-1 py-0.5 rounded">?npub=npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Profile Info */}
      <div className="mb-8">
        <Card className="border-purple-200/50 dark:border-purple-700/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-purple-200 dark:border-purple-700">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                  {displayName[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {displayName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {images.length} {images.length === 1 ? 'image' : 'images'} on Blossom
                </p>
              </div>
            </div>
            {metadata?.about && (
              <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm">
                {metadata.about}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card
            key={image.hash}
            className="group overflow-hidden border-purple-200/50 dark:border-purple-700/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
            onClick={() => setSelectedImageIndex(index)}
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
            }}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* Image */}
              <img
                src={image.url}
                alt={image.description || 'Blossom image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {image.description && (
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    {image.dimensions && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {image.dimensions}
                      </span>
                    )}
                    {image.size && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {formatFileSize(parseInt(image.size))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <ImageModal
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
