import { useState } from 'react';
import { useBlossomImages } from '@/hooks/useBlossomImages';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageModal } from '@/components/ImageModal';

interface BlossomGalleryProps {
  npub: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function BlossomGallery({ npub }: BlossomGalleryProps) {
  const { data: images, isLoading, error, isFetching } = useBlossomImages();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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
                  This user hasn't posted any images yet. The gallery auto-refreshes every 15 seconds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Refresh Indicator */}
      {isFetching && !isLoading && (
        <div className="fixed top-20 right-4 z-20 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300"
        style={{ opacity: isFetching && !isLoading ? 0.7 : 1 }}
      >
        {images.map((image, index) => (
          <Card
            key={`${image.noteId}-${index}`}
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
                alt="Image from note"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {image.content && (
                    <p className="text-white text-sm line-clamp-2 mb-2">
                      {image.content.replace(/https?:\/\/[^\s]+/g, '').trim()}
                    </p>
                  )}
                  <p className="text-white/60 text-xs">
                    {formatTimestamp(image.createdAt)}
                  </p>
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
