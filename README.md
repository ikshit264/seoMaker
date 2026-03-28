<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/734392b1-eb84-4955-80c2-0583b3929c5e

## Run locally

**Prerequisites:** Node.js

1. Install dependencies with `npm install`
2. Set `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `.env.local`
3. Start the app with `npm run dev`
4. Validate the code with `npm test` and `npm run lint`

## AI blog content storage

AI-generated blog content is normalized before it is saved, for both PostgreSQL and MongoDB.

- `draft_layout_json`: normalized editor payload in the shape `{ blocks: [...] }`
- `content`: same normalized payload for backward compatibility and simple extraction
- `published_layout_json`: normalized published payload when provided

The easiest extraction path is the existing `/api/db/items` response, which returns the same normalized structure for SQL and no-SQL records.
