
# MAIP Portfolio Edit Guide

This site is built with React and Tailwind CSS. To update content, follow these steps:

### 1. Updating Phenotype Data (Demo)
Open `constants.ts`. All the strata and phenotype rules used in the Results demo are stored in the `STRATA_DATA` array. You can add new phenotypes or modify existing ones there.

### 2. Result Metrics & Bars
Open `constants.ts` to edit the `C_INDEX_RESULTS` array.
- **Scaling:** Bars in the Results table are scaled relative to `MAX_DELTA_C`. Ensure this constant matches the maximum `deltaC` in your table.
- **Animation:** The bars use `IntersectionObserver` in `Results.tsx` to animate width from 0 to target when visible.

### 3. Flowing Takeaway Text
The sequence animation in the "One-sentence takeaway" is defined via a custom CSS `@keyframe` in `pages/Results.tsx`. You can adjust the speed by changing `6s` in the `animation` property.

### 4. Demo Interface
The "Demo Only" callout and QC panel are hardcoded in `pages/Results.tsx`. Update the labels in the `QC verification status` list to reflect real pipeline checks as needed.
