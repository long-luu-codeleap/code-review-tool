# Dark Mode Glassmorphic UI Enhancement Implementation Plan

**Status:** ✅ Completed on 2026-02-02

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform dark mode UI with modern glassmorphic design, enhancing logo visibility, tab clarity, and warning banner prominence using blue/indigo accents.

**Architecture:** Pure CSS implementation using Tailwind v4 with custom dark mode overrides in globals.css. Applies glassmorphic effects (backdrop blur, multi-layer shadows, subtle borders) to cards, inputs, and interactive elements. Enhances logo with brightness filters, redesigns tabs as segmented control, and makes warning banner prominent with amber glassmorphic styling.

**Tech Stack:** Tailwind CSS v4, Next.js 16, CSS filters, backdrop-filter, multi-layer box-shadows

---

## Task 1: Update Base Dark Mode Colors

**Files:**
- Modify: `app/globals.css:85-117`

**Step 1: Update dark mode color variables**

Replace the entire `.dark` section with enhanced colors:

```css
.dark {
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.18 0 0);
  --card-foreground: oklch(0.98 0 0);
  --popover: oklch(0.18 0 0);
  --popover-foreground: oklch(0.98 0 0);
  --primary: oklch(0.75 0.19 264);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.22 0 0);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.22 0 0);
  --muted-foreground: oklch(0.65 0 0);
  --accent: oklch(0.24 0 0);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.65 0.25 25);
  --border: oklch(0.3 0 0);
  --input: oklch(0.25 0 0);
  --ring: oklch(0.75 0.19 264);
  --chart-1: oklch(0.55 0.25 264);
  --chart-2: oklch(0.65 0.20 162);
  --chart-3: oklch(0.70 0.18 70);
  --chart-4: oklch(0.60 0.26 304);
  --chart-5: oklch(0.64 0.24 16);
  --sidebar: oklch(0.18 0 0);
  --sidebar-foreground: oklch(0.98 0 0);
  --sidebar-primary: oklch(0.55 0.25 264);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.22 0 0);
  --sidebar-accent-foreground: oklch(0.98 0 0);
  --sidebar-border: oklch(0.3 0 0);
  --sidebar-ring: oklch(0.75 0.19 264);
}
```

**Step 2: Test the color changes**

Action: Restart dev server (`bun dev`) and toggle to dark mode
Expected: Slightly lighter, more blue-tinted dark theme

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: enhance dark mode base colors with blue-tinted palette

- Lighter background for better depth perception
- Blue-tinted borders and accents (indigo oklch)
- Improved contrast for foreground elements
- Foundation for glassmorphic effects"
```

---

## Task 2: Add Glassmorphic Card Styles

**Files:**
- Modify: `app/globals.css:119-126`

**Step 1: Add card enhancements after existing @layer base**

Insert after the closing brace of `@layer base` (after line 126):

```css
@layer base {
  /* ... existing code ... */
}

/* Dark Mode Glassmorphic Enhancements */
.dark {
  /* Subtle background pattern */
  body {
    background-image: radial-gradient(
      circle at 25% 25%,
      oklch(0.15 0 0) 0%,
      transparent 50%
    );
  }

  /* Card enhancements */
  [class*="rounded-lg"][class*="border"] {
    background: oklch(0.18 0 0 / 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid oklch(0.3 0 0);
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 0.3),
      0 0 0 1px oklch(0.25 0 0) inset;
  }
}
```

**Step 2: Test card appearance**

Action: Refresh page in dark mode, check Source Code/Template cards
Expected: Cards have subtle blur, depth, and blue-tinted borders

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add glassmorphic effects to cards in dark mode

- Backdrop blur on card surfaces
- Multi-layer shadows for depth
- Subtle radial background pattern"
```

---

## Task 3: Enhance Logo Visibility

**Files:**
- Modify: `components/layout/app-header.tsx:11-16`

**Step 1: Add dark mode filters to logo Image**

Replace the logo Link block:

```tsx
        <Link
          href="/evaluate"
          className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.svg"
            alt="CodeLeap Logo"
            width={200}
            height={200}
            className="dark:brightness-200 dark:contrast-125 dark:[text-shadow:0_0_20px_rgba(99,102,241,0.3)]"
          />
        </Link>
```

**Step 2: Add header shadow**

Update header className (line 9):

```tsx
    <header className="no-print sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/50 dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
```

**Step 3: Test logo visibility**

Action: Toggle dark mode, verify logo is bright and visible
Expected: Logo significantly brighter with subtle blue glow

**Step 4: Commit**

```bash
git add components/layout/app-header.tsx
git commit -m "style: enhance logo visibility in dark mode

- Apply brightness and contrast filters
- Add subtle blue glow effect
- Enhance header with shadow for depth"
```

---

## Task 4: Redesign Tab System

**Files:**
- Modify: `app/globals.css` (add after card enhancements)

**Step 1: Add tab glassmorphic styles**

Add after the card enhancements in the `.dark` block:

```css
  /* Tab improvements - Glassmorphic Segmented Control */
  [role="tablist"] {
    background: oklch(0.16 0 0 / 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid oklch(0 0 0 / 0.1);
    padding: 4px;
    border-radius: 8px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  [role="tablist"] button {
    border: 1px solid transparent;
    transition: all 0.2s ease;
    font-weight: 500;
    color: oklch(0.65 0 0);
  }

  [role="tablist"] button[data-state="active"] {
    background: oklch(0.24 0 0);
    border-color: oklch(0.75 0.19 264 / 0.3);
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 0.3),
      0 0 0 1px oklch(0.75 0.19 264 / 0.2);
    color: oklch(0.98 0 0);
    font-weight: 600;
  }

  [role="tablist"] button:hover:not([data-state="active"]) {
    background: oklch(0.20 0 0);
    border-color: oklch(0.32 0 0);
    color: oklch(0.85 0 0);
  }
```

**Step 2: Test tab appearance**

Action: Check GitHub/Folder tabs in dark mode
Expected: Clear segmented control with prominent active state

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: redesign tabs as glassmorphic segmented control

- Container with blur and inset shadow
- Clear active state with blue accent
- Smooth hover transitions
- Improved font weights for clarity"
```

---

## Task 5: Enhance Input Fields

**Files:**
- Modify: `app/globals.css` (add after tab styles)

**Step 1: Add input field styles**

Add after tab styles in `.dark` block:

```css
  /* Input field improvements */
  input[type="text"],
  input[type="url"],
  textarea {
    background: oklch(0.16 0 0 / 0.8);
    border: 1px solid oklch(0.75 0.19 264 / 0.2);
    transition: all 0.2s ease;
  }

  input[type="text"]:focus,
  input[type="url"]:focus,
  textarea:focus {
    border-color: oklch(0.75 0.19 264 / 0.5);
    box-shadow:
      0 0 0 3px oklch(0.75 0.19 264 / 0.1),
      0 1px 2px 0 rgb(0 0 0 / 0.3);
  }
```

**Step 2: Test input focus states**

Action: Click into GitHub URL input and textarea fields
Expected: Blue glow on focus with smooth transition

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: enhance input fields with glassmorphic effects

- Darker background for better contrast
- Blue-tinted borders
- Prominent focus state with glow
- Smooth transitions"
```

---

## Task 6: Enhance Primary Buttons

**Files:**
- Modify: `app/globals.css` (add after input styles)

**Step 1: Add button enhancements**

Add after input styles in `.dark` block:

```css
  /* Button enhancements */
  button:not([variant="ghost"]):not([variant="outline"]) {
    box-shadow:
      0 2px 4px 0 rgb(0 0 0 / 0.3),
      0 0 0 1px oklch(0.3 0 0);
    transition: all 0.2s ease;
  }

  button:hover:not(:disabled):not([variant="ghost"]):not([variant="outline"]) {
    box-shadow:
      0 4px 8px 0 rgb(0 0 0 / 0.4),
      0 0 0 1px oklch(0.35 0 0);
    transform: translateY(-1px);
  }

  /* Primary button accent */
  button[class*="bg-primary"] {
    background: linear-gradient(
      135deg,
      oklch(0.75 0.19 264) 0%,
      oklch(0.65 0.22 264) 100%
    );
    box-shadow:
      0 4px 12px 0 oklch(0.75 0.19 264 / 0.3),
      0 0 0 1px oklch(0.85 0.15 264 / 0.5);
  }

  button[class*="bg-primary"]:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      oklch(0.80 0.19 264) 0%,
      oklch(0.70 0.22 264) 100%
    );
    box-shadow:
      0 6px 16px 0 oklch(0.75 0.19 264 / 0.4),
      0 0 0 1px oklch(0.85 0.15 264 / 0.6);
    transform: translateY(-2px);
  }
```

**Step 2: Test button interactions**

Action: Hover over "Fetch" and "Evaluate" buttons
Expected: Blue gradient with lift effect and enhanced shadow

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: enhance buttons with gradients and lift effects

- Blue gradient for primary buttons
- Lift effect on hover (translateY)
- Multi-layer shadows with blue glow
- Smooth transitions for all states"
```

---

## Task 7: Enhance Warning Banner

**Files:**
- Modify: `app/globals.css` (add after button styles)

**Step 1: Add warning banner styles**

Add after button styles in `.dark` block:

```css
  /* Warning banner enhancement */
  [class*="amber"][class*="border"],
  [class*="yellow"][class*="border"] {
    background: linear-gradient(
      135deg,
      oklch(0.30 0.12 70 / 0.3) 0%,
      oklch(0.25 0.12 80 / 0.3) 100%
    );
    backdrop-filter: blur(8px);
    border: 2px solid oklch(0.70 0.18 75 / 0.6) !important;
    box-shadow:
      0 4px 12px 0 oklch(0.55 0.15 75 / 0.3),
      0 0 0 1px oklch(0.60 0.15 75 / 0.2) inset;
  }

  [class*="amber"] [class*="text-amber"],
  [class*="yellow"] [class*="text-amber"] {
    color: oklch(0.85 0.15 75) !important;
  }

  [class*="amber"] strong,
  [class*="yellow"] strong {
    color: oklch(0.90 0.18 75) !important;
    font-weight: 600;
  }

  [class*="amber"] .lucide-alert-triangle,
  [class*="yellow"] .lucide-alert-triangle {
    color: oklch(0.85 0.18 75);
  }
```

**Step 2: Test warning banner**

Action: Scroll to footer, check disclaimer banner
Expected: Prominent amber banner with good contrast and glow

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: enhance warning banner with prominent glassmorphic design

- Amber gradient background with blur
- Strong border with glow effect
- Enhanced text contrast
- Brighter icon color
- Multi-layer shadows for depth"
```

---

## Task 8: Final Visual QA

**Files:**
- No file changes

**Step 1: Full page visual test**

Actions:
1. Restart dev server (`bun dev`)
2. Navigate to `/evaluate` page
3. Toggle between light and dark modes
4. Check each enhanced element:
   - Logo visibility and glow
   - Header shadow
   - Card glassmorphic effects
   - Tab active/hover states
   - Input focus states
   - Button hover lift effects
   - Warning banner prominence

Expected:
- All elements have depth and glassmorphic styling in dark mode
- Light mode remains unchanged
- Smooth transitions on all interactions
- No visual glitches or layout shifts

**Step 2: Test on different viewport sizes**

Actions:
1. Test on mobile viewport (375px)
2. Test on tablet viewport (768px)
3. Test on desktop viewport (1440px)

Expected: All glassmorphic effects work across viewports

**Step 3: Performance check**

Action: Open DevTools > Performance, record interaction
Expected: No frame drops, smooth 60fps animations

---

## Task 9: Final Commit and Cleanup

**Files:**
- Modify: `docs/plans/2026-02-02-dark-mode-glassmorphic-ui.md`

**Step 1: Mark plan as completed**

Add completion status to plan file at the top:

```markdown
**Status:** ✅ Completed on 2026-02-02
```

**Step 2: Final commit**

```bash
git add docs/plans/2026-02-02-dark-mode-glassmorphic-ui.md
git commit -m "docs: mark dark mode UI enhancement plan as completed

All glassmorphic enhancements implemented:
- Base colors updated with blue-tinted palette
- Cards with backdrop blur and depth
- Logo brightness filters and glow
- Segmented control tabs
- Enhanced input focus states
- Button gradients with lift effects
- Prominent warning banner

Ready for review."
```

**Step 3: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no errors

---

## Success Criteria

- ✅ Logo clearly visible in dark mode
- ✅ Active tab immediately distinguishable
- ✅ Warning banner prominent and readable
- ✅ Cards have depth with glassmorphic effect
- ✅ Inputs have clear focus states
- ✅ Buttons have lift effect on hover
- ✅ All animations smooth (60fps)
- ✅ Light mode unchanged
- ✅ No accessibility regressions
- ✅ Build succeeds

---

**Total Implementation Time:** ~30-40 minutes
**Total Tasks:** 9
**Commits:** 8
