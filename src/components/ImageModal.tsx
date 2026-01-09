import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NostrEvent } from '@nostrify/nostrify';

interface BlossomImage {
  url: string;
  noteId: string;
  content: string;
  createdAt: number;
  event: NostrEvent;
}

interface ImageModalProps {
  images: BlossomImage[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageModal({ images, initialIndex, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDebug, setShowDebug] = useState(true);
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = currentImage.url.split('.').pop()?.split('?')[0] || 'jpg';
      a.download = `image-${currentImage.noteId.slice(0, 8)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Toggle Debug Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-16 z-10 text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          setShowDebug(!showDebug);
        }}
      >
        <Code className="h-6 w-6" />
      </Button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Main Content Area */}
      <div
        className="relative w-full h-[90vh] mx-4 flex gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className={`relative ${showDebug ? 'flex-1' : 'w-full'} h-full flex items-center justify-center`}>
          <img
            src={currentImage.url}
            alt="Image from note"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="w-96 h-full bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Code className="h-5 w-5" />
                Nostr Event
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(currentImage.event, null, 4)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Image Info Overlay - only show when debug is hidden */}
      {!showDebug && (
        <div
          className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {currentImage.content && (
                <p className="text-white text-base mb-3 line-clamp-3">
                  {currentImage.content.replace(/https?:\/\/[^\s]+/g, '').trim()}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span>{formatDate(currentImage.createdAt)}</span>
                {(() => {
                  const rssi = extractRSSI(currentImage.event);
                  const signalInfo = getWifiSignalInfo(rssi);
                  return rssi !== null ? (
                    <span className={`flex items-center gap-1 ${signalInfo.color}`}>
                      <span>{signalInfo.emoji}</span>
                      <span>{rssi} dBm</span>
                      <span className="text-white/50">({signalInfo.strength})</span>
                    </span>
                  ) : null;
                })()}
                {images.length > 1 && (
                  <span>
                    {currentIndex + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => window.open(currentImage.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Counter for mobile */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm md:hidden">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getWifiSignalInfo(rssi: number | null): { strength: string; color: string; bars: number; emoji: string } {
  if (rssi === null) {
    return { strength: 'Unknown', color: 'text-gray-400', bars: 0, emoji: '📡' };
  }

  if (rssi >= -30) {
    return { strength: 'Excellent', color: 'text-green-400', bars: 4, emoji: '📶' };
  } else if (rssi >= -50) {
    return { strength: 'Good', color: 'text-green-400', bars: 3, emoji: '📶' };
  } else if (rssi >= -60) {
    return { strength: 'Fair', color: 'text-yellow-400', bars: 2, emoji: '📶' };
  } else if (rssi >= -70) {
    return { strength: 'Weak', color: 'text-orange-400', bars: 1, emoji: '📶' };
  } else if (rssi >= -80) {
    return { strength: 'Very Weak', color: 'text-red-400', bars: 1, emoji: '📶' };
  } else {
    return { strength: 'Unusable', color: 'text-red-600', bars: 0, emoji: '❌' };
  }
}

function extractRSSI(event: any): number | null {
  // Look for rssi or wifi_rssi in tags
  const rssiTag = event.tags.find((tag: string[]) =>
    tag[0] === 'rssi' || tag[0] === 'wifi_rssi' || tag[0] === 'signal'
  );

  if (rssiTag && rssiTag[1]) {
    const value = parseInt(rssiTag[1]);
    return isNaN(value) ? null : value;
  }

  return null;
}
