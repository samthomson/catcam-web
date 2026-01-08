# Blossom Picture Gallery

A beautiful, decentralized image gallery built on Nostr that displays all pictures from a specific user's Blossom server uploads.

![Blossom Gallery](https://img.shields.io/badge/Nostr-Powered-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNSAxNkw5LjA4NiAxMS40MTRDOS40NjYgMTEuMDM0IDEwLjAzNCAxMS4wMzQgMTAuNDE0IDExLjQxNEwxNiAxNk0xNCAxNEwxNS41ODYgMTIuNDE0QzE1Ljk2NiAxMi4wMzQgMTYuNTM0IDEyLjAzNCAxNi45MTQgMTIuNDE0TDIwIDE0TTE0IDhILjAxTTYgMjBIMThDMTkuMTA0NiAyMCAyMCAxOS4xMDQ2IDIwIDE4VjZDMjAgNC44OTU0MyAxOS4xMDQ2IDQgMTggNEg2QzQuODk1NDMgNCA0IDQuODk1NDMgNCA2VjE4QzQgMTkuMTA0NiA0Ljg5NTQzIDIwIDYgMjBaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)
![Built with Shakespeare](https://img.shields.io/badge/Built%20with-Shakespeare-ff69b4?style=for-the-badge)

## 🌟 Features

- **Decentralized Image Storage**: Fetches images from Blossom servers (NIP-94)
- **Beautiful UI**: Gradient-filled, modern design with smooth animations
- **Responsive Grid**: Adaptive layout that works perfectly on all devices
- **Full-Screen Viewer**: Click any image to view in an immersive modal
- **Image Navigation**: Keyboard shortcuts (← → ESC) and click navigation
- **Download Support**: Download images directly from the viewer
- **Profile Integration**: Displays author profile with avatar and bio
- **Real-time Loading**: Skeleton states and progressive image loading
- **Dark Mode**: Full dark mode support

## 🚀 Technology Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Nostrify** - Nostr protocol integration
- **TanStack Query** - Data fetching and caching
- **Blossom Protocol** - Decentralized file storage

## 📸 What is Blossom?

[Blossom](https://github.com/hzrd149/blossom) is a set of standards (BUDs - Blossom Upgrade Documents) for dealing with servers that store files addressable by their SHA-256 hash. It provides a decentralized alternative to traditional file hosting.

This gallery specifically:
- Queries the **bs.samt.st** Blossom relay
- Fetches **Kind 1063** events (File Metadata)
- Displays images with their metadata (dimensions, size, description)
- Validates file integrity using SHA-256 hashes

## 🎯 Current Configuration

**Default User**: `npub1yvtgsglj7vgrw2u2gkqsvz9gj3uq9hv4dsrjzw7y83kkhqwkg2ysk2x2m3`
**Relay Pool**: Uses default configured Nostr relays

## 🔧 Customization

### Change User via URL Parameter

The easiest way to view a different user's Blossom uploads is by adding a URL parameter:

```
?npub=npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac
```

### Change Default User

To permanently change the default user, edit `src/pages/Index.tsx`:

```typescript
return params.get('npub') || 'npub1your_npub_here';
```

### Important Notes

⚠️ **Not all users have Blossom uploads**: Kind 1063 (File Metadata) events are only published when users upload files to Blossom servers. If you see "No Images Found", it means either:
- The user hasn't uploaded any images to Blossom
- Their images are stored on relays not in your configured relay pool
- The Blossom uploads haven't propagated to the queried relays yet

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
- Queries Kind 1063 events from specified relay
- Validates and filters image events
- Sorts by creation date

## 🔑 Nostr Integration

The app uses several Nostr event kinds:

- **Kind 1063**: File Metadata (images with urls, hashes, dimensions)
- **Kind 0**: User Metadata (profile info, avatar, bio)

Required tags for Kind 1063 events:
- `url`: Download URL for the image
- `x`: SHA-256 hash for verification
- `m`: MIME type (filtered to image/* only)

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

- **Blossom Protocol**: [@hzrd149](https://github.com/hzrd149)
- **Nostr Protocol**: The Nostr community
- **Shakespeare**: AI-powered development platform

---

**Vibed with [Shakespeare](https://shakespeare.diy)** ✨
