# MD Anderson — iPhone/iPad Intune Enrollment Walkthrough

An interactive, tap-along guide (66 steps) that walks an end user through enrolling an
iPhone or iPad into Intune, with real screenshots, guided hotspots, and voiceover
narration on the Duo / Microsoft Multifactor step.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project layout

```
index.html            page shell + viewport meta for mobile
src/main.jsx          React entry point
src/App.jsx           the entire walkthrough (steps, hotspots, audio)
public/img/           66 sanitized screenshots + logo
public/audio/         4 voiceover clips used on step 24
```

## Editing the walkthrough

Everything lives in the `STEPS` array near the top of `src/App.jsx`. A step looks like:

```js
{ id: 12, section: "Enroll", title: "Enter MDA email",
  narration: "…",
  image: IMG.screen12,
  hx: 82, hy: 46,            // hotspot position, % of the phone screen
  htext: "Type your email",  // tooltip
  sensitive: true }          // shows the "credentials stay hidden" badge
```

- **Move a red dot**: change `hx` / `hy`. They are percentages, not pixels.
- **Swap a screenshot**: drop a new file into `public/img/`, then point `image` at it.
- **Add a wait screen**: add `wait: 3000` plus an optional `waitLabel`.
- **Add a step**: insert it into `STEPS` and keep the `id` values sequential.

## Audio

Step 24 plays four MP3 clips from `public/audio/`. Browsers refuse to start audio on
their own, so the app plays a silent clip on the user's first click to "unlock" the
audio element. By the time they reach step 24, narration plays automatically. If a
browser still blocks it, a "Play voiceover" button appears.

## Privacy note

Screenshots were sanitized before commit: real email addresses, a staff photo, and a
precise-location map were blurred. Duo verification codes are left visible because they
are single-use and expire. Re-check any new screenshot before adding it.

## Deploy (Vercel)

Vercel auto-detects Vite, so no configuration is required.

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` sets long-lived cache headers on `/img` and `/audio` so repeat visits
don't re-download the screenshots.
