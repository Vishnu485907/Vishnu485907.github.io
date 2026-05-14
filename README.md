# Framefield Studio

A Higgsfield-inspired cinematic landing page built with React, Vite, `tRPC`, and a small server proxy that keeps generation keys off the client.

## What it does

- Replaces the default marketing page with a dark gallery-first studio experience.
- Ships a working image flow backed by `higgsfield-ai/soul/standard`.
- Ships a working video flow backed by `bytedance/seedance/v1/lite`.
- Polls Higgsfield request status and renders completed images or videos in the UI.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `HIGGSFIELD_API_KEY` and `HIGGSFIELD_API_SECRET`.
3. Add the rest of the existing backend values your local setup needs.
4. Run `npm install` if dependencies are missing.
5. Start the app with `npm run dev`.

## Commands

- `npm run dev` starts the Vite app and Hono API server.
- `npm run check` runs TypeScript project checks.
- `npm run build` builds the client and bundles the API server.

## Notes

- The frontend intentionally keeps the same black, lime, dense-card energy as the reference site, but uses original branding and copy.
- Video generation supports both text-to-video and image-to-video. If you already generated an image, you can feed that result back into the video panel with one click.
