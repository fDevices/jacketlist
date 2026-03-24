```markdown
# Design System Specification: The Literary Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Archivist**. We are moving away from the cluttered, transactional nature of standard e-commerce and toward a high-end editorial experience. This system treats every book discovery as an intentional act of curation. 

To break the "template" look, we prioritize **Intentional Asymmetry**. This means using generous, uneven white space to guide the eye, allowing typography to bleed across container boundaries, and utilizing a "stacked paper" depth model. We avoid rigid grids in favor of a layout that feels like a well-composed magazine spread—breathable, authoritative, and sophisticated.

---

## 2. Color Theory & Tonal Depth
Our palette is rooted in the tactile world of high-quality paper and ink. We rely on subtle shifts in warmth rather than harsh lines to define our environment.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. Physical boundaries must be established solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a "well" or "platform" effect.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base Layer:** `surface` (#faf9f5) – The master canvas.
*   **Secondary Sections:** `surface-container-low` (#f4f4f0) – For recessed content areas.
*   **Primary Interactive Elements:** `surface-container-lowest` (#ffffff) – For cards and inputs to "pop" forward against the cream base.
*   **Signature Textures:** For Hero sections or primary CTAs, use a subtle linear gradient transitioning from `primary` (#000000) to `primary-container` (#1c1b1b) at a 15-degree angle. This provides a "carbon" depth that flat black cannot achieve.

### The Glass & Gradient Rule
Floating navigation bars or high-level overlays should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-blur` of 20px. This allows the rich colors of book jackets to bleed through the UI, making the system feel integrated and organic.

---

## 3. Typography: The Editorial Voice
Typography is the cornerstone of this system. We pair the intellectual weight of a transitional serif with the clinical precision of a modern sans-serif.

*   **Display & Headlines (Newsreader):** Used for titles and storytelling. The high x-height and elegant terminals of Newsreader evoke the feeling of a prestige literary journal. 
    *   *Note:* Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for a "premium" headline feel.
*   **UI & Body (Inter):** Used for functional text, metadata, and long-form reviews. Inter provides maximum legibility at small scales.
    *   *Note:* `body-md` (0.875rem) should be the standard for book descriptions to maintain an airy, sophisticated density.

| Role | Token | Font | Size | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `display-lg` | Newsreader | 3.5rem | 600 |
| **Section Head** | `headline-md` | Newsreader | 1.75rem | 500 |
| **Book Title** | `title-lg` | Inter | 1.375rem | 600 |
| **Body Text** | `body-md` | Inter | 0.875rem | 400 |
| **Metadata** | `label-md` | Inter | 0.75rem | 500 (All Caps, +0.05em tracking) |

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering**.

*   **Ambient Shadows:** When a card must float (e.g., a hover state), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(27, 28, 26, 0.05)`. The shadow color is a 5% opacity version of `on-surface`, creating a natural ambient occlusion rather than a "dirty" grey smudge.
*   **The Ghost Border:** If accessibility requires a stroke (e.g., high-contrast mode), use a "Ghost Border": `outline-variant` (#c4c7c7) at **15% opacity**. 
*   **The "Vignette" Effect:** For large image containers, apply a very subtle inner shadow to the top edge to mimic the natural curve of a book’s spine or page.

---

## 5. Components

### Cards (The "Book Block")
*   **Style:** `surface-container-lowest` (#ffffff) background.
*   **Corner Radius:** `lg` (0.5rem) for a soft, approachable feel.
*   **Structure:** No divider lines. Use `spacing-6` (2rem) of vertical white space to separate the cover image from the metadata.
*   **Hover:** Transition to a slightly higher elevation using an Ambient Shadow; do not change the background color.

### Buttons (The "Calligraphy" Variants)
*   **Primary:** Background: `primary` (#000000). Text: `on-primary` (#ffffff). Shape: `md` (0.375rem).
*   **Secondary:** Background: `secondary-fixed` (#ffe088). Text: `on-secondary-fixed` (#241a00). Use for "Add to Library" or highlights.
*   **Tertiary (Text-Only):** `label-md` style, `primary` color, with a 1px underline that appears on hover.

### Filter Chips (The "Library Tags")
*   **Unselected:** `surface-container-high` (#e9e8e4) background.
*   **Selected:** `secondary` (#735c00) background with `on-secondary` (#ffffff) text. 
*   **Shape:** `full` (pill-shaped) to contrast against the rectangular nature of book covers.

### Input Fields
*   **Style:** "Underline-only" or "Minimalist Box." 
*   **Background:** `surface-container-low` (#f4f4f0).
*   **Active State:** The bottom border transitions to `secondary` (#735c00) with a 2px thickness. No "glow" effects.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 8.5rem on the left, 5.5rem on the right) for editorial pages to create a dynamic reading flow.
*   **Do** use the `secondary` (Amber/Gold) sparingly. It is a "high-density" color meant for badges, ratings, and critical call-to-actions.
*   **Do** allow book covers to be the hero. The UI should act as a neutral, high-end gallery frame.

### Don't:
*   **Don't** use 100% black (#000000) for body text; use `on-surface` (#1b1c1a) to maintain the "ink on paper" softness.
*   **Don't** use dividers. Use the `spacing` scale (specifically `spacing-8` or `spacing-10`) to create "visual silences" between content blocks.
*   **Don't** use high-speed animations. Transitions should be slow and ease-in-out (e.g., 300ms) to reflect a calm, bibliophilic atmosphere.

---

## 7. Spacing & Rhythm
We follow a 0.35rem base unit, but emphasize large-scale breathing room:
*   **Component Padding:** `spacing-4` (1.4rem).
*   **Section Gaps:** `spacing-16` (5.5rem) or `spacing-20` (7rem).
*   **Container Corner Radius:** Standardize on `lg` (0.5rem) for main containers and `md` (0.375rem) for interactive elements.

This system is designed to feel like a quiet, sunlit library—orderly, prestigious, and deeply focused on the written word.