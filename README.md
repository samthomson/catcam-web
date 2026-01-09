# Nostr Picture Gallery

A beautiful, decentralized image gallery built on Nostr that displays all images from a user's posts (kind 1 notes).

![Blossom Gallery](https://img.shields.io/badge/Nostr-Powered-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNSAxNkw5LjA4NiAxMS40MTRDOS40NjYgMTEuMDM0IDEwLjAzNCAxMS4wMzQgMTAuNDE0IDExLjQxNEwxNiAxNk0xNCAxNEwxNS41ODYgMTIuNDE0QzE1Ljk2NiAxMi4wMzQgMTYuNTM0IDEyLjAzNCAxNi45MTQgMTIuNDE0TDIwIDE0TTE0IDhILjAxTTYgMjBIMThDMTkuMTA0NiAyMCAyMCAxOS4xMDQ2IDIwIDE4VjZDMjAgNC44OTU0MyAxOS4xMDQ2IDQgMTggNEg2QzQuODk1NDMgNCA0IDQuODk1NDMgNCA2VjE4QzQgMTkuMTA0NiA0Ljg5NTQzIDIwIDYgMjBaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)
![Built with Shakespeare](https://img.shields.io/badge/Built%20with-Shakespeare-ff69b4?style=for-the-badge)

## 🌟 Features

- **Image Extraction**: Finds all images posted in user's kind 1 notes
- **Beautiful UI**: Gradient-filled, modern design with smooth animations
- **Responsive Grid**: Adaptive layout that works perfectly on all devices
- **Full-Screen Viewer**: Click any image to view in an immersive modal
- **Image Navigation**: Keyboard shortcuts (← → ESC) and click navigation
- **Download Support**: Download images directly from the viewer
- **Profile Integration**: Displays author profile with avatar and bio
- **Note Context**: Shows the original note text with each image
- **Real-time Loading**: Skeleton states and progressive image loading
- **Dark Mode**: Full dark mode support

## 🚀 Technology Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Nostrify** - Nostr protocol integration
- **TanStack Query** - Data fetching and caching
- **Blossom Protocol** - Decentralized file storage

## 🎯 Current Configuration

**Pubkey**: `23168823f2f310372b8a45810608a8947802dd956c07213bc43c6d6b81d64289`
**Relay**: `wss://relay.samt.st`

## 📝 How It Works

The gallery fetches all kind 1 (Short Text Note) events from the specified user, then extracts image URLs from the content. It supports common image formats:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.bmp`
- `.svg`

## 🔧 Customization

To change the pubkey or relay, edit `src/hooks/useBlossomImages.ts`:

```typescript
const pubkey = 'your_pubkey_here';
const relay = nostr.relay('wss://your.relay.here');
```

## 📦 Project Structure

```
src/
├── components/
│   ├── BlossomGallery.tsx    # Main gallery component
│   └── ImageModal.tsx         # Full-screen image viewer
├── hooks/
│   └── useBlossomImages.ts    # Custom hook for fetching Blossom images
└── pages/
    └── Index.tsx              # Main page with header and footer
```

## 🎨 Key Components

### BlossomGallery
Main gallery component that:
- Fetches images using the `useBlossomImages` hook
- Displays profile information
- Renders responsive image grid
- Handles image selection and modal display

### ImageModal
Full-screen image viewer with:
- Keyboard navigation (← → ESC)
- Download functionality
- Image metadata display
- Responsive design

### useBlossomImages
Custom React Query hook that:
- Decodes npub to pubkey
- Queries kind 1 events from Nostr relays
- Extracts image URLs using regex pattern matching
- Sorts by creation date

## 🔑 Nostr Integration

The app fetches:

- **Kind 1**: Short Text Notes containing image URLs
- **Kind 0**: User Metadata (profile info, avatar, bio)

## 🎭 Design Principles

- **Apple-level polish**: Meticulous attention to detail
- **Purposeful animations**: Fade-in on scroll, hover effects
- **Gradient magic**: Purple to pink color scheme
- **Responsive first**: Mobile, tablet, and desktop optimized
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚢 Deployment

The project is built with Vite and can be deployed to any static hosting service:

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📝 License

Public domain - built with [Shakespeare](https://shakespeare.diy)

## 🙏 Credits

- **Nostr Protocol**: The Nostr community
- **Shakespeare**: AI-powered development platform

---

**Vibed with [Shakespeare](https://shakespeare.diy)** ✨
