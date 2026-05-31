
<p align="center">
	<img src="public/logo.png" alt="ToolZone logo" width="396" />
</p>

# ToolZone

A browser-first production console for PDF, image, web, text, and developer utilities, built to run fast in the client with a small Node backend for the URL shortener service.

## Key Features

- PDF Tools: merge, split, rotate, delete pages, preview, and image-to-PDF workflows with local file handling.
- Image Tools: PNG to JPG, JPG to PNG, image-to-PDF, and PDF-to-PNG conversion with browser-only processing.
- Web Tools: QR code generation and URL shortening with optional alias and expiry support.
- Text Tools: word count, character count, and case conversion utilities.
- Developer Tools: password, UUID, JSON, and JWT helpers for everyday workflow tasks.
- Category Lanes: structured entry points that group tools by purpose and keep navigation predictable.
- Featured Workflows: curated paths that surface high-use tools in a compact, scan-friendly layout.
- Local-first behavior: files are processed in the browser wherever possible, which reduces latency and keeps user data off the server.

## Architecture & Tech Stack

- React 18 + TypeScript: component-driven UI with typed tool logic and predictable state flow.
- Vite: fast development server and production build pipeline.
- Tailwind CSS + custom CSS variables: utility-first layout with theme-aware surfaces, flat cards, and dark-mode consistency.
- React Router: page-level routing for the home screen, tool pages, and category pages.
- PDF tooling: `pdf-lib` for PDF editing, `jspdf` for image-to-PDF generation, and `pdfjs-dist` for PDF rendering.
- Image processing: HTMLCanvasElement, File APIs, and browser-native downloads for client-side conversions.
- Backend service: Express is used for the short-link API, stats, and redirect behavior.
- Runtime storage: local browser processing for most tools, with backend persistence only where the feature requires it.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Clone the repository

```bash
git clone <your-repository-url>
cd ToolZone
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file only if you want the URL shortener to target a backend that is not running on the default local address.

```bash
VITE_API_BASE_URL=http://127.0.0.1:3001
```

If you do not create this file, the app uses the local default shown above.

### Run the application in development

Start the frontend and backend together:

```bash
npm run dev
```

Run only the API server:

```bash
npm run backend
```

Run only the frontend preview after building:

```bash
npm run preview
```

## Deployment & Production

Build the client for production:

```bash
npm run build
```

The build output is written to `dist/`.

For production deployments that include the URL shortener, run the Express backend separately and point `VITE_API_BASE_URL` to that service before building the client.

Typical deployment flow:

1. Build the frontend with `npm run build`.
2. Deploy the `dist/` folder to your static host.
3. Deploy the Node backend to a service that supports long-running processes.
4. Set `VITE_API_BASE_URL` to the public backend URL and rebuild the client.
