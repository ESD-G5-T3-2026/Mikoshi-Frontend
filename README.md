# Mikoshi Frontend

>This is the frontend for the Mikoshi project, built with React and Vite.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at the address shown in the terminal (default: http://localhost:6620/).

## Available Scripts

- `npm run dev` — Start the development server with hot reload.
- `npm run build` — Build the app for production (output in `dist/`).
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint to check for code issues.

## Notes

- The dev server is configured to run on port 6620. If this port is in use, stop the conflicting process or change the port in `vite.config.js`.
- For HTTPS or custom host settings, see `vite.config.js`.

## Project Structure

- `src/` — React source code
- `public/` — Static assets
- `package.json` — Project metadata and scripts
- `vite.config.js` — Vite configuration

## Troubleshooting

- If you encounter issues with dependencies, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

---
For more information, see the comments in the source files or contact the project maintainers.
