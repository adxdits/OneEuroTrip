# Frontend with Vite + React + MUI

This frontend application has been migrated from Next.js to Vite with React and Material-UI (MUI).

## Technologies Used

- **Vite** - Fast build tool and development server
- **React 19** - UI library with TypeScript support
- **Material-UI (MUI)** - React component library
- **Emotion** - CSS-in-JS library (required for MUI)
- **TypeScript** - Type safety

## Installed Packages

- `@mui/material` - Core MUI components
- `@mui/icons-material` - MUI icons
- `@emotion/react` - CSS-in-JS runtime
- `@emotion/styled` - Styled components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── CustomButton.tsx     # Example MUI component
│   └── index.ts            # Components export file
├── assets/                 # Static assets
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## MUI Configuration

The application is configured with:
- MUI ThemeProvider for consistent theming
- CssBaseline for CSS normalization
- Custom theme setup in `main.tsx`

## Example Components

The app includes an example `CustomButton` component demonstrating how to create reusable MUI-based components with TypeScript.

## Development Notes

- MUI components are tree-shakeable for optimal bundle size
- TypeScript is configured for strict type checking
- ESLint is set up for code quality
