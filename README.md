# Henry Okwudili Portfolio

## Run locally

Use Node.js 18 or newer, then install dependencies and start Vite:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production site is written to `dist/`.

## Add images

Each empty frame is a `<figure class="slot ...">` containing `<span class="ph">image</span>`. Put the image in `public/images/`, then replace that span with `<img src="/images/name.jpg" alt="describe it">`. The frame crops the image to size and applies grayscale and contrast styling.

## Deploy

Push the `main` branch to GitHub and import the repository in Vercel. Use the Vite preset, `npm run build` as the build command, and `dist` as the output directory.