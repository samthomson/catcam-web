import { useMemo } from 'react';
import { useSeoMeta } from '@unhead/react';
import { BlossomGallery } from '@/components/BlossomGallery';

const Index = () => {
  // Get npub from URL parameter or use default
  const targetNpub = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('npub') || 'npub1yvtgsglj7vgrw2u2gkqsvz9gj3uq9hv4dsrjzw7y83kkhqwkg2ysk2x2m3';
  }, []);

  useSeoMeta({
    title: 'Blossom Picture Gallery',
    description: 'A beautiful gallery showcasing images from Blossom servers on Nostr',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <header className="border-b border-purple-200/50 dark:border-purple-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-lg shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Blossom Gallery
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Decentralized image hosting on Nostr
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {targetNpub.slice(0, 12)}...{targetNpub.slice(-8)}
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Blossom Server
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="container mx-auto px-4 py-8">
        <BlossomGallery npub={targetNpub} />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/50 dark:border-purple-700/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by{' '}
            <a
              href="https://github.com/hzrd149/blossom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              Blossom
            </a>
            {' '}and{' '}
            <a
              href="https://shakespeare.diy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium transition-colors"
            >
              Shakespeare
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
