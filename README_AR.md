# AR Furniture Viewer

An augmented reality furniture preview application built with React, TypeScript, and Tailwind CSS. This app allows users to browse furniture items and preview them in an AR-enabled viewer.

## Features

- **Furniture Gallery**: Browse a selection of furniture items with prices and descriptions
- **AR Preview**: View furniture items in an augmented reality preview
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Smooth navigation between gallery and AR views

## Current Furniture Categories

- **Sofas**: Modern comfortable seating solutions
- **Chairs**: Office and accent chairs
- **Tables**: Dining and coffee tables
- **Shelves**: Wall-mounted storage solutions
- **Beds**: Bedroom furniture

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server
- **Three.js**: 3D rendering (coming soon for full AR support)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── App.tsx              # Main app component with gallery and AR views
├── main.tsx             # React entry point
├── index.css            # Global styles
├── components/          # Reusable React components
├── types/               # TypeScript type definitions
└── data/                # Data files
```

## Usage

1. **Browse Furniture**: The gallery displays available furniture items with preview colors
2. **Select Item**: Click on any furniture item to view it in AR preview
3. **Return to Gallery**: Use the "Back to Gallery" button to return to the browsing view

## Future Enhancements

- [ ] Real 3D models using Three.js and Babylon.js
- [ ] WebXR API integration for true camera-based AR
- [ ] Mobile device support with camera access
- [ ] Furniture placement in real environments
- [ ] Size customization and scaling
- [ ] Shopping cart integration
- [ ] Product specifications and detailed views
- [ ] User preferences and saved selections

## Mobile AR Support

To enable full AR camera support on mobile devices:

1. Ensure HTTPS is enabled (required for camera access)
2. Use WebXR-compatible browsers (Chrome 79+, Safari 15+)
3. Grant camera permissions when prompted

## Browser Compatibility

- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Supported
- Mobile browsers: Partial support (full AR coming soon)

## License

MIT

## Company Info

Built for furniture retailers to help customers visualize products before purchase.
