<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://i.postimg.cc/3Rybysvj/test2.jpg" />
</div>

## MAIP – Multimorbidity-Anchored ICU Phenotypes (Simple Presentation)

A small Vite + React app that presents the MAIP research project: multimorbidity-anchored ICU phenotyping with similarity network fusion, stability checks, and auditable rulecards. The UI walks through the rationale, pipeline, validation snapshots, and an interactive rulecard demo.

## Stack
- React 19 + TypeScript with React Router (hash routing for static hosting)
- Tailwind CSS for styling
- Vite for dev server and build

## Quick start
1. Install deps: `npm install`
2. Run the dev server: `npm run dev` (opens at the URL printed by Vite)
3. Production build: `npm run build` → output in `dist/`
4. Preview the build locally: `npm run preview`

## Project layout
- `App.tsx` – top-level routing and layout wrapper
- `components/Layout.tsx` – nav, footer, and page chrome
- `pages/Home.tsx` – overview of the problem/approach
- `pages/Technical.tsx` – pipeline steps and internal validation table
- `pages/Results.tsx` – outcome lift, rulecard demo, and key message
- `constants.ts` / `types.ts` – demo fixtures for phenotypes and C-index metrics
- `index.css` / `tailwind.config.cjs` – styling tokens and Tailwind setup

## Editing the demo content
- Update phenotypes, rules, and validation numbers in `constants.ts`.
- Tweak colors/spacing in `index.css` or Tailwind config.
- HashRouter is used so the static build works on GitHub Pages or any static host without server-side routing.
