# Shodasha — Component Documentation Agent

> This file instructs sub-agents to fetch real component code/markdown from verified library URLs.
> Do NOT generate dummy code. Do NOT assume what a component looks like. Visit the URL. Read the page. Copy what exists.

---

## FETCH INSTRUCTIONS (for every component below)

### Tool Selection

| Library type | Tool to use |
|-------------|-------------|
| **Premium UI libraries** (Kibo UI, Animata, HeroUI, Smooth UI, Dice UI, COSS UI, Cult UI, Fancy Components, Motion Primitives) | `webfetch` — their docs are NOT indexed in docfork |
| **Mainstream frameworks** (React, Next.js, Motion, GSAP, Tailwind, Tauri) | `docfork_search_docs` + `docfork_fetch_doc` — these ARE indexed |

### Step-by-Step

1. **Visit every URL** listed under a need category — do not skip any library
   - Use `webfetch` with `format: "markdown"` for premium library pages
   - Use `docfork_fetch_doc` for mainstream framework documentation
2. **Read the component page carefully**: understand the API, props, imports, animation approach, styling mechanism
3. **Copy the real code** — look for "Copy code", "View source", or code block with full implementation. If the page provides a markdown/API section, copy that too
4. **If the page has no explicit copy mechanism**: extract the example code from code blocks + API docs from tables
5. **Save the result** as `Feature_docs/<feature>/<component-name>.md` with this structure:

   ```markdown
   # Component: <Name>
   
   - **Library**: <library name>
   - **URL**: <original URL>
   - **Fetched by**: sub-agent
   
   ## Code
   
   ```tsx
   // full component code here — copied verbatim from source
   ```
   
   ## API / Props
   
   | Prop | Type | Default | Description |
   |------|------|---------|-------------|
   
   ## Dependencies
   
   - List any required packages, imports, peer deps
   ```

6. **Never write placeholder or abbreviated code.** If the page is long, copy the full code — do not truncate with `// ...` comments
7. **Note the license** if visible (MIT / Pro / Free)

## WHEN MULTIPLE COMPONENTS EXIST FOR ONE NEED

You will find multiple libraries offering the same component type (e.g. 5 different Tab components). Here is how to handle it:

- **Evaluate each one** on: animation quality, visual polish, API cleanliness, customization options, dependency weight
- **Do NOT default to HeroUI.** Other libraries (Animata, Smooth UI, Kibo UI, Cult UI, Dice UI, Motion Primitives) may provide more animated, more premium options
- **If exactly one stands out as clearly best**: fetch that one, and note in the file why it was chosen
- **If multiple are equally strong**: fetch all of them into separate files named `<component-name>--<library>.md`, then flag the user for a decision
- **Ask the user** only when you truly cannot decide — otherwise make a judgment call based on our editorial minimal design style (clean, spaced, animated, not cluttered)

## QUALITY RANKING CRITERIA

When deciding which component of a given type to use, rank in this order:

1. **Animation fluidity** — does it use Motion/GSAP with springs, not just CSS transitions?
2. **Visual polish** — does it look like a premium design system, not a basic HTML element?
3. **API ergonomics** — clean props, good TypeScript types, easy to customize
4. **Aesthetic match** — does it fit editorial minimal design? Not overly skeuomorphic or playful
5. **License** — prefer MIT/Free over Pro/paid
6. **Dependency weight** — prefer Motion-based over massive component kits

---

## NEED CATEGORIES → COMPONENT URLS

Fetch each section below. Create one markdown file per component.

---

### NAVIGATION — Top Tab Bar

#### Tabs
- HeroUI — https://www.heroui.com/en/docs/react/components/tabs
- Animata — https://animata.design/docs/tabs/fluid-tabs
- Animata — https://animata.design/docs/tabs/gooey-tabs
- Animata — https://animata.design/docs/tabs/shift-tabs
- Smooth UI — https://smoothui.dev/docs/components/animated-tabs
- COSS UI — https://coss.com/ui/docs/components/tabs
- Cult UI — https://www.cult-ui.com/docs/components/direction-aware-tabs

#### Badge (counts, streaks)
- HeroUI — https://www.heroui.com/en/docs/react/components/badge
- COSS UI — https://coss.com/ui/docs/components/badge
- Dice UI — https://www.diceui.com/docs/components/radix/badge-overflow
- Smooth UI — https://smoothui.dev/docs/components/notification-badge

#### Tooltip
- HeroUI — https://www.heroui.com/en/docs/react/components/tooltip
- COSS UI — https://coss.com/ui/docs/components/tooltip
- Smooth UI — https://smoothui.dev/docs/components/animated-tooltip

#### Popover
- HeroUI — https://www.heroui.com/en/docs/react/components/popover
- COSS UI — https://coss.com/ui/docs/components/popover
- COSS UI — https://coss.com/ui/docs/components/preview-card
- Smooth UI — https://smoothui.dev/docs/components/gooey-popover
- Smooth UI — https://smoothui.dev/docs/components/rich-popover
- Motion Primitives — https://motion-primitives.com/docs/morphing-popover
- Cult UI — https://www.cult-ui.com/docs/components/popover

---

### DASHBOARD — Analytics & Overview

#### Card
- HeroUI — https://www.heroui.com/en/docs/react/components/card
- COSS UI — https://coss.com/ui/docs/components/card
- Animata — https://animata.design/docs/card/glowing-card
- Animata — https://animata.design/docs/card/flip-card
- Animata — https://animata.design/docs/card/card-stack
- Animata — https://animata.design/docs/card/card-comment
- Animata — https://animata.design/docs/card/swap-text-card
- Animata — https://animata.design/docs/card/github-card-shiny
- Animata — https://animata.design/docs/card/github-card-skew
- Animata — https://animata.design/docs/card/case-study-card
- Animata — https://animata.design/docs/card/collab-card
- Animata — https://animata.design/docs/card/card-spread
- Animata — https://animata.design/docs/card/led-board
- Cult UI — https://www.cult-ui.com/docs/components/minimal-card
- Cult UI — https://www.cult-ui.com/docs/components/cutout-card
- Cult UI — https://www.cult-ui.com/docs/components/texture-card
- Cult UI — https://www.cult-ui.com/docs/components/shift-card
- Cult UI — https://www.cult-ui.com/docs/components/expandable
- Smooth UI — https://smoothui.dev/docs/components/glow-hover-card
- Smooth UI — https://smoothui.dev/docs/components/expandable-cards
- Smooth UI — https://smoothui.dev/docs/components/product-card
- Smooth UI — https://smoothui.dev/docs/components/switchboard-card
- Smooth UI — https://smoothui.dev/docs/components/scrollable-card-stack
- Fancy Components — https://www.fancycomponents.dev/docs/components/blocks/stacking-cards

#### Charts (Pie, Bar, Line, Donut, Ring)
All free unless marked otherwise.
- Animata — https://animata.design/docs/graphs/bar-chart
- Animata — https://animata.design/docs/graphs/donut-chart
- Animata — https://animata.design/docs/graphs/gauge-chart
- Animata — https://animata.design/docs/graphs/ring-chart
- Animata — https://animata.design/docs/graphs/progress
- Dice UI — https://www.diceui.com/docs/components/radix/gauge
- Dice UI — https://www.diceui.com/docs/components/radix/circular-progress
- Dice UI — https://www.diceui.com/docs/components/radix/stat
- ~~Cult UI Analytics Chart~~ — ❌ PRO (paid) — https://pro.cult-ui.com/docs/components/analytics-chart — SKIP

#### Number / Stats Animation (counters, tickers)
- Animata — https://animata.design/docs/text/counter
- Animata — https://animata.design/docs/text/ticker
- Smooth UI — https://smoothui.dev/docs/components/number-flow
- Fancy Components — https://www.fancycomponents.dev/docs/components/text/basic-number-ticker
- Motion Primitives — https://motion-primitives.com/docs/animated-number
- Motion Primitives — https://motion-primitives.com/docs/sliding-number
- Cult UI — https://www.cult-ui.com/docs/components/animated-number
- Kibo UI — https://www.kibo-ui.com/components/ticker

#### Progress Bar
- HeroUI — https://www.heroui.com/en/docs/react/components/progress-bar
- HeroUI — https://www.heroui.com/en/docs/react/components/progress-circle
- COSS UI — https://coss.com/ui/docs/components/progress
- Animata — https://animata.design/docs/graphs/progress
- Dice UI — https://www.diceui.com/docs/components/radix/circular-progress
- Smooth UI — https://smoothui.dev/docs/components/animated-progress-bar

#### Toast (notifications)
- HeroUI — https://www.heroui.com/en/docs/react/components/toast
- COSS UI — https://coss.com/ui/docs/components/toast
- Smooth UI — https://smoothui.dev/docs/components/basic-toast

#### Checkbox
- HeroUI — https://www.heroui.com/en/docs/react/components/checkbox
- HeroUI — https://www.heroui.com/en/docs/react/components/checkbox-group
- COSS UI — https://coss.com/ui/docs/components/checkbox
- COSS UI — https://coss.com/ui/docs/components/checkbox-group
- Dice UI — https://www.diceui.com/docs/components/radix/checkbox-group
- Smooth UI — https://smoothui.dev/docs/components/checkbox

#### Skeleton (loading)
- HeroUI — https://www.heroui.com/en/docs/react/components/skeleton
- COSS UI — https://coss.com/ui/docs/components/skeleton
- Animata — https://animata.design/docs/skeleton/list
- Animata — https://animata.design/docs/skeleton/report
- Animata — https://animata.design/docs/skeleton/wide-card
- Animata — https://animata.design/docs/skeleton/code
- Animata — https://animata.design/docs/skeleton/receipt
- Animata — https://animata.design/docs/skeleton/cookie-banner
- Smooth UI — https://smoothui.dev/docs/components/skeleton-loader

#### Spinner / Loading
- HeroUI — https://www.heroui.com/en/docs/react/components/spinner
- COSS UI — https://coss.com/ui/docs/components/spinner
- Animata — https://animata.design/docs/progress/spinner
- Kibo UI — https://www.kibo-ui.com/components/spinner
- Smooth UI — https://smoothui.dev/docs/components/grid-loader

#### Empty State
- COSS UI — https://coss.com/ui/docs/components/empty

#### Widgets (Dashboard-specific)
All from Animata:
- Weekly Progress — https://animata.design/docs/widget/weekly-progress
- Study Timer — https://animata.design/docs/widget/study-timer
- Calendar Event — https://animata.design/docs/widget/calendar-event
- Reminder — https://animata.design/docs/widget/reminder
- Reminder Widget — https://animata.design/docs/widget/reminder-widget
- Water Tracker — https://animata.design/docs/widget/water-tracker
- Expense Tracker — https://animata.design/docs/widget/expense-tracker
- Sleep Tracker — https://animata.design/docs/widget/sleep-tracker
- Storage Status — https://animata.design/docs/widget/storage-status
- Shopping List — https://animata.design/docs/widget/shopping-list
- Score Board — https://animata.design/docs/widget/score-board
- Profile — https://animata.design/docs/widget/profile
- Notes — https://animata.design/docs/widget/notes
- Battery — https://animata.design/docs/widget/battery
- Clock With Photo — https://animata.design/docs/widget/clock-with-photo
- Delivery Card — https://animata.design/docs/widget/delivery-card
- Weather Card — https://animata.design/docs/widget/weather-card
- Alarm Clock — https://animata.design/docs/widget/alarm-clock

Pick the most useful 3-5 widgets for a productivity/time-tracking dashboard. Fetch only those — do not fetch all 18.

---

### BOARD — Kanban

#### Kanban
- Kibo UI — https://www.kibo-ui.com/components/kanban
- Dice UI — https://www.diceui.com/docs/components/radix/kanban

**Both are strong. Fetch both, compare, and recommend one.**

#### Drawer / Slide Panel
- HeroUI — https://www.heroui.com/en/docs/react/components/drawer
- COSS UI — https://coss.com/ui/docs/components/drawer
- COSS UI — https://coss.com/ui/docs/components/sheet

#### Modal / Dialog
- HeroUI — https://www.heroui.com/en/docs/react/components/modal
- HeroUI — https://www.heroui.com/en/docs/react/components/alert-dialog
- COSS UI — https://coss.com/ui/docs/components/dialog
- COSS UI — https://coss.com/ui/docs/components/alert-dialog
- Animata — https://animata.design/docs/overlay/modal
- Smooth UI — https://smoothui.dev/docs/components/basic-modal
- Smooth UI — https://smoothui.dev/docs/components/dialog
- Motion Primitives — https://motion-primitives.com/docs/dialog
- Motion Primitives — https://motion-primitives.com/docs/morphing-dialog
- Motion Primitives — https://motion-primitives.com/docs/morphing-popover
- Dice UI — https://www.diceui.com/docs/components/radix/responsive-dialog
- Kibo UI — https://www.kibo-ui.com/components/dialog-stack

#### TextField / Input
- HeroUI — https://www.heroui.com/en/docs/react/components/text-field
- HeroUI — https://www.heroui.com/en/docs/react/components/input
- COSS UI — https://coss.com/ui/docs/components/input
- COSS UI — https://coss.com/ui/docs/components/input-group
- Smooth UI — https://smoothui.dev/docs/components/animated-input

#### TextArea
- HeroUI — https://www.heroui.com/en/docs/react/components/text-area
- COSS UI — https://coss.com/ui/docs/components/textarea

#### Select
- HeroUI — https://www.heroui.com/en/docs/react/components/select
- COSS UI — https://coss.com/ui/docs/components/select
- Smooth UI — https://smoothui.dev/docs/components/select

#### Tags
- Kibo UI — https://www.kibo-ui.com/components/tags
- HeroUI — https://www.heroui.com/en/docs/react/components/tag-group
- Dice UI — https://www.diceui.com/docs/components/radix/tags-input
- Smooth UI — https://smoothui.dev/docs/components/animated-tags

#### Combobox / Autocomplete
- Kibo UI — https://www.kibo-ui.com/components/combobox
- HeroUI — https://www.heroui.com/en/docs/react/components/combo-box
- HeroUI — https://www.heroui.com/en/docs/react/components/autocomplete
- COSS UI — https://coss.com/ui/docs/components/combobox
- COSS UI — https://coss.com/ui/docs/components/autocomplete
- Dice UI — https://www.diceui.com/docs/components/radix/combobox
- Smooth UI — https://smoothui.dev/docs/components/combobox
- Smooth UI — https://smoothui.dev/docs/components/searchable-dropdown

#### Color Picker
- Kibo UI — https://www.kibo-ui.com/components/color-picker
- HeroUI — https://www.heroui.com/en/docs/react/components/color-picker
- Dice UI — https://www.diceui.com/docs/components/radix/color-picker
- Dice UI — https://www.diceui.com/docs/components/radix/color-swatch
- Cult UI — https://www.cult-ui.com/docs/components/color-picker

---

### HABITS — Monthly Calendar + Heatmap

#### Calendar / Month Navigation
- HeroUI — https://www.heroui.com/en/docs/react/components/calendar
- HeroUI — https://www.heroui.com/en/docs/react/components/date-picker
- HeroUI — https://www.heroui.com/en/docs/react/components/range-calendar
- COSS UI — https://coss.com/ui/docs/components/calendar
- COSS UI — https://coss.com/ui/docs/components/date-picker
- Kibo UI — https://www.kibo-ui.com/components/calendar
- Kibo UI — https://www.kibo-ui.com/components/mini-calendar

#### Contribution Graph / Heatmap (GitHub-style)
- Kibo UI — https://www.kibo-ui.com/components/contribution-graph
- Smooth UI — https://smoothui.dev/docs/components/contribution-graph
- Cult UI — https://www.cult-ui.com/docs/components/hero-heatmap

#### Date Picker
- HeroUI — https://www.heroui.com/en/docs/react/components/date-picker
- COSS UI — https://coss.com/ui/docs/components/date-picker
- Dice UI — https://www.diceui.com/docs/components/radix/time-picker

---

### TIMELINE — Activity Log & Analytics

#### Table
- HeroUI — https://www.heroui.com/en/docs/react/components/table
- COSS UI — https://coss.com/ui/docs/components/table
- Kibo UI — https://www.kibo-ui.com/components/table
- Dice UI — https://www.diceui.com/docs/components/radix/data-table
- Dice UI — https://www.diceui.com/docs/components/radix/data-grid

#### Pagination
- HeroUI — https://www.heroui.com/en/docs/react/components/pagination
- COSS UI — https://coss.com/ui/docs/components/pagination
- Smooth UI — https://smoothui.dev/docs/components/pagination

#### Search Field
- HeroUI — https://www.heroui.com/en/docs/react/components/search-field

#### Animated Timeline (visual activity stream)
- Animata — https://animata.design/docs/progress/animatedtimeline
- Dice UI — https://www.diceui.com/docs/components/radix/timeline
- Smooth UI — https://smoothui.dev/docs/components/scrollable-card-stack

#### Segmented Control / Toggle Group
- HeroUI — https://www.heroui.com/en/docs/react/components/toggle-button-group
- HeroUI — https://www.heroui.com/en/docs/react/components/button-group
- COSS UI — https://coss.com/ui/docs/components/toggle-group
- Dice UI — https://www.diceui.com/docs/components/radix/segmented-input

---

### SETTINGS — Preferences & Configuration

#### Switch / Toggle
- HeroUI — https://www.heroui.com/en/docs/react/components/switch
- COSS UI — https://coss.com/ui/docs/components/switch
- COSS UI — https://coss.com/ui/docs/components/toggle
- Animata — https://animata.design/docs/button/toggle-switch
- Smooth UI — https://smoothui.dev/docs/components/animated-toggle

#### Slider
- HeroUI — https://www.heroui.com/en/docs/react/components/slider
- COSS UI — https://coss.com/ui/docs/components/slider
- Dice UI — https://www.diceui.com/docs/components/radix/angle-slider

#### Accordion / Disclosure
- HeroUI — https://www.heroui.com/en/docs/react/components/disclosure
- HeroUI — https://www.heroui.com/en/docs/react/components/disclosure-group
- HeroUI — https://www.heroui.com/en/docs/react/components/accordion
- COSS UI — https://coss.com/ui/docs/components/accordion
- COSS UI — https://coss.com/ui/docs/components/collapsible
- Smooth UI — https://smoothui.dev/docs/components/accordion
- Motion Primitives — https://motion-primitives.com/docs/accordion
- Motion Primitives — https://motion-primitives.com/docs/disclosure

#### Button
- HeroUI — https://www.heroui.com/en/docs/react/components/button
- HeroUI — https://www.heroui.com/en/docs/react/components/button-group
- COSS UI — https://coss.com/ui/docs/components/button
- Animata — https://animata.design/docs/button/ripple-button
- Animata — https://animata.design/docs/button/shining-button
- Animata — https://animata.design/docs/button/slide-arrow-button
- Animata — https://animata.design/docs/button/ai-button
- Animata — https://animata.design/docs/button/status-button
- Animata — https://animata.design/docs/button/swipe-button
- Animata — https://animata.design/docs/button/animated-follow-button
- Animata — https://animata.design/docs/button/duolingo
- Cult UI — https://www.cult-ui.com/docs/components/neumorph-button
- Cult UI — https://www.cult-ui.com/docs/components/texture-button
- Cult UI — https://www.cult-ui.com/docs/components/metal-button
- Cult UI — https://www.cult-ui.com/docs/components/cosmic-button
- Cult UI — https://www.cult-ui.com/docs/components/border-beam-button
- Cult UI — https://www.cult-ui.com/docs/components/bg-animate-button
- Cult UI — https://www.cult-ui.com/docs/components/gradient-button-group
- Smooth UI — https://smoothui.dev/docs/components/smooth-button
- Smooth UI — https://smoothui.dev/docs/components/button-copy
- Smooth UI — https://smoothui.dev/docs/components/clip-corners-button
- Smooth UI — https://smoothui.dev/docs/components/dot-morph-button
- Smooth UI — https://smoothui.dev/docs/components/magnetic-button

#### Dropzone / File Upload
- Kibo UI — https://www.kibo-ui.com/components/dropzone
- Dice UI — https://www.diceui.com/docs/components/radix/file-upload
- Smooth UI — https://smoothui.dev/docs/components/animated-file-upload

#### Form
- HeroUI — https://www.heroui.com/en/docs/react/components/form
- COSS UI — https://coss.com/ui/docs/components/form
- Smooth UI — https://smoothui.dev/docs/components/form

#### Alert / Banner
- HeroUI — https://www.heroui.com/en/docs/react/components/alert
- COSS UI — https://coss.com/ui/docs/components/alert
- COSS UI — https://coss.com/ui/docs/components/alert-dialog
- Kibo UI — https://www.kibo-ui.com/components/banner
- Kibo UI — https://www.kibo-ui.com/components/announcement

---

### CROSS-CUTTING

#### Theme Switcher (Dark Mode)
- Kibo UI — https://www.kibo-ui.com/components/theme-switcher

#### Command Palette (⌘K)
- COSS UI — https://coss.com/ui/docs/components/command

#### Dropdown Menu
- HeroUI — https://www.heroui.com/en/docs/react/components/dropdown
- COSS UI — https://coss.com/ui/docs/components/menu
- Smooth UI — https://smoothui.dev/docs/components/basic-dropdown
- Smooth UI — https://smoothui.dev/docs/components/dropdown-menu

#### Separator / Divider
- HeroUI — https://www.heroui.com/en/docs/react/components/separator
- COSS UI — https://coss.com/ui/docs/components/separator

#### Scroll Area
- HeroUI — https://www.heroui.com/en/docs/react/components/scroll-shadow
- COSS UI — https://coss.com/ui/docs/components/scroll-area

#### Marquee
- Animata — https://animata.design/docs/container/marquee
- Kibo UI — https://www.kibo-ui.com/components/marquee
- Dice UI — https://www.diceui.com/docs/components/radix/marquee
- Fancy Components — https://www.fancycomponents.dev/docs/components/blocks/simple-marquee
- Fancy Components — https://www.fancycomponents.dev/docs/components/blocks/marquee-along-svg-path

#### Breadcrumb
- HeroUI — https://www.heroui.com/en/docs/react/components/breadcrumbs
- COSS UI — https://coss.com/ui/docs/components/breadcrumb
- Smooth UI — https://smoothui.dev/docs/components/breadcrumb

#### Avatar / Avatar Group
- HeroUI — https://www.heroui.com/en/docs/react/components/avatar
- COSS UI — https://coss.com/ui/docs/components/avatar
- Kibo UI — https://www.kibo-ui.com/components/avatar-stack
- Dice UI — https://www.diceui.com/docs/components/radix/avatar-group
- Smooth UI — https://smoothui.dev/docs/components/animated-avatar-group

---

### ❌ SKIP — PRO / PAID COMPONENTS

These are NOT free. Do not attempt to fetch them.

| Library | Component | Pro URL |
|---------|-----------|---------|
| Cult UI | Analytics Chart (all charts) | https://pro.cult-ui.com/docs/components/analytics-chart |
| Cult UI | Agent Suggest Card Stack | https://pro.cult-ui.com/docs/components/agent-suggest-card-stack |
| Cult UI | All "Marketing" blocks | https://pro.cult-ui.com/docs/blocks/ (prefixed) |
| Cult UI | Feature Sticky Section | https://pro.cult-ui.com/docs/components/feature-sticky-section |
| Motion Primitives | Advanced templates | https://pro.motion-primitives.com (Pro tier) |

---

## LIBRARY OVERVIEW (for quick reference)

| Library | Root URL | Total Components | Style |
|---------|----------|-----------------|-------|
| HeroUI | https://www.heroui.com/en/docs/react/components | 71 | Utility-based, animated, accessible |
| Animata | https://animata.design/components | 154 | Highly animated, creative, motion-first |
| COSS UI | https://coss.com/ui/docs | 54 | Clean, accessible, form-heavy |
| Kibo UI | https://www.kibo-ui.com/components | 41 | Unique widgets, kanban, contribution graph |
| Dice UI | https://www.diceui.com/docs/components | 47 | Radix-based, accessible, data-heavy |
| Smooth UI | https://smoothui.dev/docs/components | 50+ | Smooth animations, premium feel |
| Cult UI | https://www.cult-ui.com/docs/components | 77 (free) | Texture-rich, creative, some Pro locked |
| Fancy Components | https://www.fancycomponents.dev/components | 40 | GSAP-heavy, premium animations |
| Motion Primitives | https://motion-primitives.com/docs | 35+ | Motion-based, minimal, composable |

---

## PROGRESS TRACKER

After fetching a component file, mark it here:

```
[ ] Tabs
[ ] Badge
[ ] Tooltip
[ ] Popover
[ ] Card
[ ] Charts
[ ] Number Ticker
[ ] Progress Bar
[ ] Toast
[ ] Checkbox
[ ] Skeleton
[ ] Spinner
[ ] Empty State
[ ] Dashboard Widgets (pick 3-5)
[ ] Kanban
[ ] Drawer
[ ] Modal
[ ] TextField
[ ] TextArea
[ ] Select
[ ] Tags
[ ] Combobox
[ ] Color Picker
[ ] Calendar
[ ] Contribution Graph / Heatmap
[ ] Date Picker
[ ] Table
[ ] Pagination
[ ] Search Field
[ ] Animated Timeline
[ ] Segmented Control
[ ] Theme Switcher
[ ] Command Palette
[ ] Dropdown Menu
[ ] Separator
[ ] Scroll Area
[ ] Marquee
[ ] Breadcrumb
[ ] Avatar
[ ] Switch / Toggle
[ ] Slider
[ ] Accordion
[ ] Button
[ ] Dropzone
[ ] Form
[ ] Alert / Banner
```
