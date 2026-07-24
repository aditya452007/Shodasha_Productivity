# Shodasha — Premium UI Library Research

> **Date**: 2026-07-24
> **Scope**: Comprehensive survey of free/premium UI libraries suitable for a React/Next.js productivity dashboard (time tracking, habits, kanban, timeline, analytics).
> **Method**: Visited each library's documentation site, examined component offerings, evaluated animation quality, accessibility, and licensing.

---

## Table of Contents

1. [Already Installed / In Use](#1-already-installed--in-use)
2. [shadcn/ui](#2-shadcnui)
3. [Tremor](#3-tremor)
4. [Radix UI](#4-radix-ui)
5. [Ark UI](#5-ark-ui)
6. [Motion (Framer Motion)](#6-motion-framer-motion)
7. [Sonner](#7-sonner)
8. [Vaul](#8-vaul)
9. [cmdk](#9-cmdk)
10. [Recharts](#10-recharts)
11. [Nivo](#11-nivo)
12. [Visx](#12-visx)
13. [Aceternity UI](#13-aceternity-ui)
14. [Magic UI](#14-magic-ui)
15. [Animata](#15-animata)
16. [21st.dev](#16-21stdev)
17. [HeroUI (NextUI)](#17-heroui-nextui)
18. [GSAP Consideration](#18-gsap-consideration)
19. [Summary: Feature-Need Matrix](#19-summary-feature-need-matrix)
20. [Top Recommendations for Shodasha](#20-top-recommendations-for-shodasha)

---

## 1. Already Installed / In Use

### From `package.json`

| Package | Version | Purpose |
|---------|---------|---------|
| `motion` | ^12.42.2 | Animation library (Framer Motion successor) |
| `lucide-react` | ^1.26.0 | Icon library |
| `zustand` | ^5.0.14 | State management |
| `@dnd-kit/core` | ^6.3.1 | Drag & drop (kanban) |
| `@dnd-kit/sortable` | ^10.0.0 | Sortable DnD |
| `tailwindcss` | ^4.3.3 | CSS framework |
| `next` | ^16.2.11 | Framework |

### Key Observations

- **`motion` v12.42.2** is the library formerly known as Framer Motion. It provides: `motion.div`, `AnimatePresence`, layout animations, spring physics, scroll animations, gestures (hover/press/drag), and timeline sequences. This is the project's primary animation engine and is already a strong foundation.
- **No toast library** is installed — Sonner would be a natural fit.
- **No command palette** — cmdk would fill this gap.
- **No chart library** — Recharts, Nivo, or Visx needed.
- **No headless UI primitives** — Radix UI / Ark UI would help with accessible dialogs, popovers, etc.
- **No drawer component** — Vaul or HeroUI Drawer needed.
- **Animata** has been used (referenced in COMPONENT-LIBRARY-INDEX.md) — additional components from it are beneficial.

---

## 2. shadcn/ui

**URL**: https://ui.shadcn.com  
**Docs**: https://ui.shadcn.com/docs/components  
**GitHub**: 120k+ stars  
**License**: MIT  
**Cost**: 100% free

### Overview
Not an npm package — it's a collection of copy-paste components built on Radix UI primitives with Tailwind CSS. Components are added via CLI (`npx shadcn@latest add button`). Recently added React Aria support alongside the existing Radix-based approach.

### Components Available (60+)

| Category | Components |
|----------|-----------|
| **Layout** | Card, Accordion, Tabs, Sheet, Sidebar, Resizable, Scroll Area |
| **Forms** | Button, Button Group, Checkbox, Combobox, Date Picker, Field, Input, Input OTP, Label, Native Select, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group |
| **Overlays** | Alert Dialog, Dialog, Drawer, Dropdown Menu, Hover Card, Menubar, Popover, Context Menu |
| **Data** | Table, Data Table, Calendar, Chart (Recharts wrapper), Carousel, Pagination |
| **Feedback** | Alert, Badge, Progress, Skeleton, Spinner, Toast (new), Empty |
| **Navigation** | Breadcrumb, Navigation Menu, Pagination, Tabs |
| **Other** | Avatar, Aspect Ratio, Collapsible, Command, Kbd, Separator, Tooltip, Typography, Direction |
| **New** | Attachment, Bubble, Marker, Message, Message Scroller |

### Key Components for Shodasha

- **Chart**: Recharts-wrapped chart component with 6 variants (Area, Bar, Line, Pie, Radial, Radar)
- **Sidebar**: Full sidebar layout system with collapsible sections
- **Drawer/Sheet**: Bottom/top/side drawer (uses Vaul internally)
- **Command**: Command palette component
- **Data Table**: TanStack Table wrapper with sorting/filtering/pagination
- **Toast**: Newly added toast component
- **Empty**: Empty state component
- **Calendar**: Date picker and calendar components

### Animation Quality
Uses CSS transitions primarily. Charts animate via Recharts' built-in animation. The new React Aria components use Motion under the hood for more fluid animations.

### Accessibility
Excellent — built on Radix UI primitives and React Aria, both of which follow WAI-ARIA standards. Keyboard navigation, screen reader support, focus management all built in.

### Recommendation for Shodasha: **HIGH**
shadcn/ui would provide the foundational component layer for the entire app. Add via CLI, pick only what's needed. Particularly valuable: Sidebar, Data Table, Drawer, Command, Chart, Toast, Empty, Calendar.

---

## 3. Tremor

**URL**: https://tremor.so  
**Docs**: https://tremor.so/docs/getting-started/installation  
**GitHub**: 15k+ stars, 300k+ monthly downloads  
**License**: Apache 2.0  
**Cost**: Core library free; Blocks & Templates have premium tiers (recently acquired by Vercel)

### Overview
Tremor is a React component library specifically built for dashboards and data visualization. Built on Recharts and Radix UI with Tailwind CSS. Recently joined Vercel. The core library is fully open-source with 35+ components.

### Components Available

| Category | Components |
|----------|-----------|
| **Visualizations** | Area Chart, Bar Chart, Combo Chart, Bar List, Category Bar, Donut Chart, Line Chart, Progress Bar, Progress Circle, Spark Chart, Tracker |
| **Inputs** | Calendar, Checkbox, Date Picker, Date Range Picker, Dropdown Menu, Input, Label, Radio Card Group, Radio Group, Select, Select Native, Slider, Switch, Textarea, Toggle |
| **UI** | Accordion, Badge, Button, Callout, Card, Dialog, Divider, Drawer, Popover, Table, Tabs, Tab Navigation, Toast, Tooltip |
| **Utilities** | chartUtils, cx, focusInput, hasErrorInput, focusRing |

### Key Components for Shodasha

- **Area/Bar/Line Chart**: Production-ready chart wrappers around Recharts
- **Donut Chart**: Perfect for habit completion rings
- **Progress Circle**: Circular progress indicators for daily goals
- **Spark Chart**: Mini sparkline charts for dashboard cards
- **Tracker**: GitHub-style contribution tracker (great for habits)
- **Bar List**: Horizontal bar lists for rankings/breakdowns
- **Category Bar**: Stacked category comparisons
- **Date Range Picker**: For timeline filtering
- **Tab Navigation**: App-level navigation tabs
- **Card**: Dashboard stat cards with built-in styling
- **Callout**: Alert/info banners

### Animation Quality
Minimal — Tremor focuses on data clarity, not animation. Charts use Recharts' built-in enter animations. No spring physics. For a productivity app that needs animated micro-interactions, Tremor alone would feel static.

### Accessibility
Good — built on Radix UI primitives. Keyboard navigable, ARIA labels, focus management.

### Recommendation for Shodasha: **MEDIUM**
Excellent for raw data visualization components (charts, progress, trackers), but lacks the animation polish for a premium feel. Use for chart components specifically, pair with Motion for animations.

---

## 4. Radix UI

**URL**: https://www.radix-ui.com  
**License**: MIT  
**Cost**: 100% free

### Overview
Two products: **Radix Primitives** (headless, unstyled UI primitives) and **Radix Themes** (styled component library). Primitives are the foundation that shadcn/ui, Tremor, and many other libraries build upon.

### Primitives Available (40+)
Accordion, Alert Dialog, Aspect Ratio, Avatar, Checkbox, Collapsible, Context Menu, Dialog, Dropdown Menu, Form, Hover Card, Label, Menubar, Navigation Menu, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tab Navigation (tabs), Toast, Toggle, Toggle Group, Tooltip, Visually Hidden.

### Key Components for Shodasha
All the primitives needed for accessible overlays, navigation, forms, and data display. Used as a dependency of other libraries — not typically used directly unless you need custom-styled, accessible primitives.

### Animation Quality
None (headless). Animations are handled by the consumer. Radix Themes uses CSS transitions.

### Accessibility
Industry-leading. WAI-ARIA compliant, keyboard navigation, focus management, screen reader support.

### Recommendation for Shodasha: **LOW (direct use)**
Already used indirectly via shadcn/ui, HeroUI, and Tremor. Direct installation only needed if custom-styled primitives are required beyond what shadcn/ui provides.

---

## 5. Ark UI

**URL**: https://ark-ui.com  
**License**: MIT  
**Cost**: 100% free (Ark UI Plus has additional components)

### Overview
Headless UI library by the Chakra UI team (now Chakra Systems). 45+ accessible components powered by state machines (Zag.js). Framework-agnostic — works with React, Solid, Vue, and Svelte. Truly unstyled — no default CSS to fight.

### Components Available (45+)
Accordion, Avatar, Carousel, Checkbox, Clipboard, Collapsible, Color Picker, Combobox, Date Picker, Date Range Picker, Dialog, Editable, Field, File Upload, Hover Card, Image, Menu, Number Input, Pagination, Pin Input, Popover, Progress, QR Code, Radio Group, Rating Group, Segment Group, Select, Signature Pad, Slider, Splitter, Switch, Table, Tabs, Tags Input, Toast, Toggle Group, Tooltip, Tree View.

### Key Components for Shodasha

- **Color Picker**: For tag/label color customization
- **Tags Input**: For habit tags, task labels
- **Date Picker / Date Range Picker**: For timeline filtering
- **File Upload**: For settings (profile image, data export)
- **Signature Pad**: Unlikely needed
- **Rating Group**: For habit quality ratings
- **QR Code**: For app pairing (mentioned in shadcn demo)
- **Clipboard**: For sharing/copying data
- **Progress**: For habit progress
- **Carousel**: For onboarding/tips
- **Splitter**: For resizable panels in dashboard
- **Tree View**: For category hierarchies

### Animation Quality
None (headless). All animation is consumer-implemented. This is a strength — you can add Motion animations without fighting library defaults.

### Accessibility
Excellent — built on state machines (Zag.js) with WAI-ARIA baked in. Very few edge cases slip through.

### Recommendation for Shodasha: **MEDIUM**
Ark UI is a strong alternative to Radix UI for headless primitives. Especially valuable for components Radix doesn't offer (Color Picker, Tags Input, File Upload, QR Code, Splitter). Use selectively where shadcn/ui doesn't have a component.

---

## 6. Motion (Framer Motion)

**URL**: https://motion.dev  
**Installed Version**: ^12.42.2  
**License**: MIT  
**Cost**: Free core; Motion+ ($199/year) for AI Kit, Motion UI, premium features

### Overview
The renamed/evolved Framer Motion library. Now supports React, JavaScript, and Vue. Core features: spring animations, layout animations, scroll-driven animations, gestures, AnimatePresence, variants, stagger, useMotionValue.

### Key Features for Shodasha
- **Spring physics**: For natural-feeling micro-interactions
- **Layout animations**: `layout` prop for smooth reordering in kanban
- **AnimatePresence**: Enter/exit animations for modals, drawers, toasts
- **Scroll animations**: Hardware-accelerated scroll-linked motion
- **Gestures**: `hover`, `press`, `drag` — drag for kanban cards
- **Variants**: Orchestrated animations for complex sequences
- **Motion values**: Real-time animation-driven state

### Animation Quality
Best-in-class for React. Spring physics, GPU-accelerated transforms, interruptible animations. The library powers Framer's entire animation engine.

### Accessibility
`prefers-reduced-motion` support via `useReducedMotion` and `useMotionPreference`. Can disable animations globally.

### Recommendation for Shodasha: **ALREADY INSTALLED — USE IT FULLY**
Motion is already in the project. Ensure it's being used for:
- All mount/unmount transitions (AnimatePresence)
- Kanban card drag (drag prop)
- Dashboard card hover effects
- Number ticker animations
- Page transitions
- Drawer/modal enter/exit animations

No additional animation library needed. GSAP is unnecessary given Motion's capabilities.

---

## 7. Sonner

**URL**: https://sonner.emilkowal.ski  
**GitHub**: 12.7k+ stars  
**License**: MIT  
**Cost**: 100% free

### Overview
An opinionated toast component for React by Emil Kowalski (the same designer behind Vaul and the "emil-design-eng" philosophy). Extremely lightweight, beautifully animated, and deeply accessible.

### Key Features
- `toast()` function called from anywhere in the app
- `<Toaster />` component renders toast container
- Support for: success, error, info, warning, loading, promise toasts
- Rich HTML content in toasts
- Swipe to dismiss
- Custom action buttons
- Dark mode
- Position configuration
- Duration customization
- Expandable toasts with descriptions

### Animation Quality
Excellent — spring-based animations for enter/exit using CSS transforms. Smooth, interruptible. Emil Kowalski's signature polish.

### Accessibility
Good — ARIA live regions, focus management, keyboard dismissible.

### Recommendation for Shodasha: **HIGH**
Sonner is the perfect toast library for a productivity app. Install via `npm install sonner`, wrap app with `<Toaster />`, then call `toast()` anywhere. Use cases:
- Task created/deleted notifications
- Habit completion celebrations
- Timer alerts
- Error notifications
- Sync status updates

---

## 8. Vaul

**URL**: https://vaul.emilkowal.ski  
**GitHub**: 8.5k+ stars  
**License**: MIT  
**Cost**: 100% free  
**Status**: Unmaintained (but stable and widely used)

### Overview
A drawer component for React by Emil Kowalski. Provides a bottom sheet / drawer that feels like iOS. Used internally by shadcn/ui's Drawer component.

### Key Features
- Bottom sheet drawer (also supports top/left/right)
- Drag to dismiss with snap points
- Nested drawers
- Scrollable content within drawer
- Portal rendering
- Focus trap
- Background overlay
- Direction-aware (LTR/RTL)

### Animation Quality
Excellent — spring animations with smooth drag gesture handling. Rubber-band effect at threshold. Feels native.

### Accessibility
Good — focus trap, keyboard escape, ARIA dialog role.

### Recommendation for Shodasha: **MEDIUM (via shadcn/ui)**
Vaul is best consumed through shadcn/ui's Drawer component, which wraps Vaul with shadcn's styling conventions. Direct install only needed if you want raw Vaul without shadcn/ui. Use cases:
- Task detail panel (bottom drawer)
- Settings panel
- Quick habit entry
- Timer configuration

---

## 9. cmdk

**URL**: https://cmdk.paco.me / https://github.com/dip/cmdk  
**GitHub**: 12.8k+ stars  
**License**: MIT  
**Cost**: 100% free

### Overview
Fast, unstyled command menu React component (⌘K). Used by Vercel, Linear, and many other products. Composable API with built-in filtering, sorting, and keyboard navigation.

### Key Features
- `<Command>` root with auto-filtering
- `<Command.Dialog>` for modal mode (radix dialog)
- `<Command.Input>` for search
- `<Command.List>` with scrollable results
- `<Command.Item>` with auto-value from text content
- `<Command.Group>` with headings
- `<Command.Empty>` for no results
- `<Command.Loading>` for async results
- `<Command.Separator>` for visual separation
- Nested pages (sub-navigation within command menu)
- Custom filter function
- `useCommandState` hook for advanced use cases

### Animation Quality
Unstyled — animation is consumer-implemented. Can be wrapped with Motion for smooth dialog transitions.

### Accessibility
Excellent — ARIA combobox pattern, keyboard navigation, focus management, screen reader support.

### Recommendation for Shodasha: **HIGH**
cmdk is the standard for command palettes in React. Install via `npm install cmdk`. Use cases:
- ⌘K global command palette for app navigation
- Quick task creation
- Habit search
- Settings navigation
- Board search/filter

---

## 10. Recharts

**URL**: https://recharts.org (redirects to https://recharts.github.io)  
**GitHub**: Well-established  
**License**: MIT  
**Cost**: 100% free  
**Version**: 3.x

### Overview
A composable charting library built on React components with SVG rendering. Uses D3 submodules for calculations but renders via React. The most popular React charting library. Used by Tremor and shadcn/ui's Chart component.

### Components Available
Area, Bar, Line, Pie, Scatter, Radar, Radial Bar, Composed, Treemap, Sankey, Funnel, Sunburst charts. Plus: ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis, Polar grids, Brush for zooming.

### Key Charts for Shodasha

- **AreaChart**: Time tracking over days/weeks
- **BarChart**: Daily task completion
- **LineChart**: Productivity trends
- **PieChart/DonutChart**: Habit completion distribution
- **RadarChart**: Multi-attribute skill/ habit balance
- **RadialBarChart**: Circular progress (habit rings)
- **ComposedChart**: Mixed chart types

### Animation Quality
Built-in SVG animation for enter transitions. Can be extended with Motion for more complex animations, but Recharts' own animations are decent for data visualization. Less fluid than a Motion-driven approach.

### Accessibility
Basic — SVG-based, uses `<title>` and `<desc>` elements. Accessible labels on data points. Not as strong as a D3-native approach but adequate for dashboard use.

### Recommendation for Shodasha: **HIGH**
Recharts is the best choice for a productivity dashboard. Use cases:
- Weekly activity chart (AreaChart)
- Habit completion bars (BarChart)
- Category breakdown (PieChart)
- Progress rings (RadialBarChart)
- Timeline view (LineChart)

Can be used directly or via Tremor/shadcn/ui wrappers for faster setup.

---

## 11. Nivo

**URL**: https://nivo.rocks  
**npm**: @nivo/core, @nivo/bar, @nivo/line, etc.  
**GitHub**: Well-established  
**License**: MIT  
**Cost**: 100% free  
**Version**: 0.99.0

### Overview
Rich dataviz library built on D3 and React. Provides higher-level components than raw D3 with server-side rendering support. More chart types than Recharts but heavier dependency footprint.

### Components Available (50+)
Bar, Line, Area, Pie, Donut, Bubble, Bullet, Calendar, Choropleth, Chord, Circle Packing, Heatmap, Map, Marimekko, Parallel Coordinates, Radar, Radial Bar, Sankey, Scatter, Stream, Sunburst, Swarm, Treemap, Waffle, Voronoi, Bump, Geo Maps.

### Key Charts for Shodasha

- **Calendar**: GitHub-style contribution calendar (perfect for habits!)
- **Heatmap**: Time-of-day activity patterns
- **Radar**: Multi-dimensional skill/habit tracking
- **Donut**: Completion rings
- **Bar**: Daily stats
- **Line**: Trends over time
- **Stream**: Activity flow over time

### Animation Quality
Good — built-in transitions and animations. Uses D3's transition system. Smooth enter/update/exit. Not as fluid as Motion but very competent for data visualization.

### Accessibility
Moderate — SVG-based with accessible labels. Less screen reader optimized than simpler libraries.

### Recommendation for Shodasha: **MEDIUM**
Nivo's **Calendar** and **Heatmap** components are unique and valuable for habit tracking. Otherwise, Recharts covers most use cases with a lighter footprint. Use Nivo specifically for:
- Habit contribution calendar (Nivo Calendar is excellent)
- Activity heatmap by time of day
- Multi-habit radar comparisons

---

## 12. Visx

**URL**: https://airbnb.io/visx (https://visx.airbnb.tech)  
**GitHub**: Airbnb  
**License**: MIT  
**Cost**: 100% free

### Overview
A collection of expressive, low-level visualization primitives for React by Airbnb. Not a charting library — it's a collection of small, independent packages for building custom visualizations. Lower-level than Recharts/Nivo, more flexible.

### Components/Packages
Annotation, Axis, Brush, Curve, Glyph, Grid, Group, Heatmap, Hover, Legend, Marker, Network, Pattern, Point, Scale, Shape, Text, Threshold, Tooltip, Voronoi, XYChart, Zoom.

### Key for Shodasha
Best suited for custom visualizations not covered by standard chart types. Overkill for a standard productivity dashboard unless you need highly custom viz. The `@visx/heatmap` could be useful for activity patterns.

### Recommendation for Shodasha: **LOW**
Visx is too low-level for this project's needs. Recharts + Nivo (Calendar/Heatmap) covers all charting needs with less code.

---

## 13. Aceternity UI

**URL**: https://ui.aceternity.com  
**License**: MIT (free components) / Pro (premium blocks & templates — paid)  
**Cost**: 200+ free components, premium blocks/templates from $49+

### Overview
Aceternity UI provides 200+ animated React components and 80+ blocks built with Framer Motion (now Motion) and Tailwind CSS. Heavily marketing/landing-page focused but includes many components adaptable for dashboards.

### Free Components Available (200+)

| Category | Components |
|----------|-----------|
| **3D/Visual** | 3D Card Effect, 3D Pin, Globe, Wavy Background, Aurora Background, Sparkles |
| **Cards** | Card Hover Effect, Infinite Moving Cards, Bento Grid |
| **Navigation** | Floating Dock, Hero Parallax, Macbook Scroll, Parallax Scroll |
| **Effects** | Background Beams, Lamp Effect, Moving Border, Tracing Beam |
| **Text** | Text Generate Effect, Animated Tooltip |
| **Timeline** | Timeline component |
| **Blocks (free)** | Hero Sections, Feature Sections, Bento Grids, Logo Clouds, Stats Sections, Pricing, Testimonials, Team, FAQs, Navbars, Footers, Cards, Sidebars, Backgrounds, Login/Signup, Empty States |

### Key Components for Shodasha

- **Bento Grid**: Dashboard layout with animated cells
- **Timeline**: Animated activity timeline
- **Card Hover Effect**: Dashboard stat cards with hover animations
- **Floating Dock**: MacOS-style dock for quick navigation
- **Aurora Background**: Animated gradient backgrounds for hero/empty states
- **Animated Tooltip**: Enhanced tooltips for metrics
- **Background Beams**: Ambient background effects
- **Empty States**: Free blocks for empty state design
- **Stats Sections**: Dashboard stat display blocks

### Animation Quality
Excellent — all built on Framer Motion (Motion) with spring physics, parallax, and smooth transitions. This is the library's primary strength. Animation is production-grade.

### Accessibility
Mixed — marketing focus means some components lack full ARIA support. Workable for visual/dashboard elements, less suitable for form controls.

### Recommendation for Shodasha: **MEDIUM**
Aceternity UI excels at visual effects and landing page components. For a dashboard app, the most valuable components are Bento Grid, Timeline, Empty States, and Card effects. Avoid for form controls or core UI — use shadcn/ui for those.

---

## 14. Magic UI

**URL**: https://magicui.design  
**License**: MIT (free) / Pro (premium templates — paid)  
**Cost**: 150+ free animated components; Pro templates from $49+

### Overview
150+ free and open-source animated React components built with Motion and Tailwind CSS. Designed as a companion to shadcn/ui. High-quality animations, good variety of effects components.

### Free Components Available (150+)

| Category | Components |
|----------|-----------|
| **Layout** | Bento Grid, Dock, Marquee, Safari, iPhone, Android |
| **Effects** | Animated Beam, Border Beam, Shine Border, Magic Card, Glare Hover, Meteors, Particles, Confetti |
| **Backgrounds** | Flickering Grid, Animated Grid Pattern, Retro Grid, Ripple, Dot Pattern, Grid Pattern, Striped Pattern, Hexagon Pattern, Interactive Grid Pattern, Light Rays, Noise Texture |
| **Text** | Number Ticker, Text Animate, Typing Animation, Word Rotate, Morphing Text, Hyper Text, Sparkles Text, Shiny Text, Gradient Text, Text Reveal, Line Shadow, Aurora Text, Video Text, Scroll Velocity, Spinning Text, 3D Flip, Highlighter, Kinetic Text |
| **Elements** | Rainbow Button, Shimmer Button, Ripple Button, Interactive Hover Button, Pulsating Button, Shiny Button |
| **Data** | Animated Circular Progress Bar, Animated List, Scroll Progress |
| **Interactions** | Animated Theme Toggler, Smooth Cursor, Pointer, Lens, Glare Hover |
| **Misc** | File Tree, Code Comparison, Terminal, Tweet Card, Icon Cloud, Globe, Orbiting Circles, Avatar Circles, Dotted Map, Pixel Image, Cool Mode, Glyph Matrix, Comic Text, Backlight |

### Key Components for Shodasha

- **Number Ticker**: Animated stat counters on dashboard cards
- **Animated Circular Progress Bar**: Habit completion rings
- **Magic Card**: Hover-effect cards for dashboard
- **Bento Grid**: Dashboard grid layout
- **Animated List**: Activity feed with animations
- **Border Beam**: Decorative border effects for cards
- **Shimmer Button**: Premium CTA buttons
- **Animated Theme Toggler**: Dark/light mode switch
- **Dock**: Application dock for navigation
- **Confetti**: Celebration effect on habit completion
- **Globe**: 3D globe (overkill but impressive)
- **Orbiting Circles**: Visual timer/countdown element
- **Animated Grid Pattern**: Background texture
- **Scroll Progress**: Reading/activity progress bar

### Animation Quality
Excellent — all built on Motion with proper spring physics. Number ticker uses spring animations. Circular progress bar animates smoothly. Production-grade animation throughout.

### Accessibility
Good — components respect `prefers-reduced-motion`. Basic ARIA support. Text animations are accessible by default.

### Recommendation for Shodasha: **HIGH**
Magic UI is the best complement to shadcn/ui for animated effects. Specifically valuable:
- **Number Ticker**: Essential for dashboard stat cards
- **Animated Circular Progress Bar**: Perfect for habit rings
- **Magic Card**: Animated stat cards
- **Bento Grid**: Dashboard grid layout
- **Animated List**: Activity/timeline feed
- **Confetti**: Delight on habit/task completion
- **Animated Theme Toggler**: Dark mode switch

---

## 15. Animata

**URL**: https://animata.design  
**License**: MIT  
**Cost**: 100% free, 154+ components

### Overview
Copy-paste animated React components. No npm install required — copy files directly into your repo. Already referenced in COMPONENT-LIBRARY-INDEX.md. 154+ components across 19 categories.

### Components Available (154+)

| Category | Count | Key Components for Shodasha |
|----------|-------|---------------------------|
| **Widget** | 27+ | Weekly Progress, Study Timer, Calendar Event, Reminder, Water Tracker, Expense Tracker, Sleep Tracker, Storage Status, Score Board, Profile, Notes, Battery, Clock, Weather, Alarm Clock |
| **Card** | 13+ | Glowing Card, Flip Card, Card Stack, Card Comment, Swap Text Card, Collab Card, Card Spread, Case Study Card, GitHub Card |
| **Text** | 39+ | Counter, Ticker, Typing Text, Animated Gradient, Blur Out, Bold Copy |
| **Graphs** | 5+ | Bar Chart, Donut Chart, Gauge Chart, Ring Chart, Progress |
| **Skeleton** | 6+ | List, Report, Wide Card, Code, Receipt, Cookie Banner |
| **Tabs** | 3 | Fluid Tabs, Gooey Tabs, Shift Tabs |
| **Button** | 10+ | Ripple Button, Shining Button, Slide Arrow Button, AI Button, Status Button, Swipe Button, Animated Follow, Duolingo |
| **Progress** | 2 | Animated Timeline, Spinner |
| **Scroll** | 1 | Stacked Sections |
| **Overlay** | 1 | Modal |
| **Bento Grid** | 3 | Eight, Gradient, Three |
| **Other** | 20+ | Backgrounds, Containers, FABs, Hero, Icons, Images, Lists, PreLoaders |

### Key Components for Shodasha

- **Weekly Progress**: Pre-built weekly habit tracker widget
- **Study Timer**: Pomodoro/timer widget
- **Calendar Event**: Upcoming events display
- **Reminder**: Reminder card widget
- **Counter/Ticker**: Animated number counters
- **Donut Chart**: Habit completion ring
- **Ring Chart**: Circular progress
- **Gauge Chart**: Goal progress indicator
- **Progress Bar**: Linear progress
- **Animated Timeline**: Activity log timeline
- **Fluid/Shift Tabs**: Navigation tabs
- **Card Stack**: Stacked card UI for tasks
- **Flipping Cards**: Interactive stat cards

### Animation Quality
Very good — uses CSS animations and transforms with smooth transitions. Not all components use Motion, but the animation quality is high. Widgets are particularly well-animated.

### Accessibility
Good — keyboard focus, screen reader labels, reduced-motion fallbacks mentioned as built-in.

### Recommendation for Shodasha: **HIGH**
Animata is already partially used and is one of the best sources for pre-built productivity widgets. Specifically:
- **Weekly Progress**: Directly usable for the Habits dashboard
- **Study Timer**: For the timer/ stopwatch feature
- **Calendar Event**: For upcoming events on dashboard
- **Reminder**: For task reminders
- **Animated Timeline**: For the Timeline tab
- **Counter/Ticker**: For dashboard stat cards
- **Donut/Ring Chart**: For habit completion visualization

---

## 16. 21st.dev

**URL**: https://21st.dev  
**License**: Components have individual licenses (mostly MIT)  
**Cost**: Free to browse; 2 free copies/day; Membership for unlimited ($)

### Overview
A marketplace/registry of 10,000+ React + Tailwind CSS components by 700+ design engineers. Components ship as AI prompts — paste into Cursor, Claude Code, v0, or Lovable to install. Features components from Aceternity UI, Magic UI, shadcn/ui, Origin UI, Geist, Kibo UI, Fancy Components, Motion Primitives, COSS, and many more.

### Key Features
- 2,000+ marketing blocks (hero, shaders, backgrounds, footers)
- 2,100+ UI components (buttons, cards, navigation, sign-ins)
- Components from multiple libraries aggregated in one place
- AI-prompt based installation
- shadcn CLI install also available
- Bookmarking system for saving favorites
- Publishing platform for component authors

### Recommendation for Shodasha: **LOW (for browsing inspiration)**
21st.dev is a discovery platform rather than a library to install. It's useful for finding components across multiple libraries, but the actual components come from the source libraries (Aceternity, Magic UI, shadcn, etc.). Use to find inspiration, then install from the source.

---

## 17. HeroUI (NextUI)

**URL**: https://www.heroui.com  
**License**: MIT (previously named NextUI)  
**Cost**: 100% free

### Overview
Beautiful, accessible React UI library built on React Aria and Tailwind CSS v4. 71+ components. Positions itself as "the modern alternative to MUI, Chakra UI, and shadcn/ui." Supports both web and native (React Native) components. Has comprehensive MCP server and agent skills.

### Components Available (71+)

| Category | Components |
|----------|-----------|
| **Layout** | Card, Accordion, Tabs, Divider, Grid |
| **Forms** | Button, Button Group, Checkbox, Checkbox Group, Combo Box, Autocomplete, Color Picker, Date Picker, Date Range Picker, Form, Input, Text Field, Text Area, Select, Slider, Switch, Radio Group, Toggle Button Group |
| **Data** | Table, Calendar, Range Calendar, Pagination |
| **Overlays** | Modal, Alert Dialog, Drawer, Dropdown, Popover, Tooltip |
| **Feedback** | Alert, Badge, Progress Bar, Progress Circle, Skeleton, Spinner, Toast |
| **Navigation** | Navbar, Breadcrumbs, Link, Tabs |
| **Other** | Avatar, Avatar Group, Chip, Image, Kbd, Scroll Shadow, Separator, Snippet, Tag Group, User |

### Key Components for Shodasha

- **Card**: Dashboard stat cards with built-in styling
- **Progress Circle**: Habit completion rings
- **Progress Bar**: Linear progress indicators
- **Toast**: Notification system
- **Drawer**: Slide panels for task details
- **Modal**: Task creation/editing
- **Alert Dialog**: Confirmations
- **Table**: Data tables for timeline
- **Calendar**: Month view for habits
- **Date Picker**: Date selection
- **Color Picker**: Tag/label colors
- **Skeleton**: Loading states
- **Spinner**: Loading indicators
- **Badge**: Streak counts, notification badges
- **Tag Group**: Task/habit labels
- **Avatar Group**: Team/contributor display

### Animation Quality
Good — uses React Aria's built-in animations with CSS. Spring-based transitions for overlays. Not as fluid as a Motion-only approach but solid.

### Accessibility
Excellent — built on React Aria, which is the most accessible React primitive library. Full keyboard navigation, screen reader support, focus management, ARIA patterns.

### Recommendation for Shodasha: **HIGH**
HeroUI is a comprehensive library that could serve as the primary UI layer. It covers almost every need:
- Dashboard: Card, Progress Circle, Progress Bar, Badge
- Board: Drawer, Modal, Table
- Habits: Calendar, Date Picker
- Settings: Form, Input, Select, Switch, Slider, Color Picker
- Global: Toast, Skeleton, Spinner, Tabs, Navbar, Avatar

However, it's heavier than shadcn/ui and may conflict with the existing Motion-based animation approach. If choosing between shadcn/ui and HeroUI as the primary library, consider:
- **shadcn/ui** for a lighter, more customizable approach with copy-paste components
- **HeroUI** for a cohesive design system with consistent styling

---

## 18. GSAP Consideration

After reviewing the GSAP skills (gsap-core, gsap-react, gsap-scrolltrigger):

### GSAP vs Motion

| Aspect | Motion | GSAP |
|--------|--------|------|
| **Bundle size** | ~10KB (tree-shaken) | ~30KB+ (with plugins) |
| **React integration** | Native (`motion.div`) | Requires `useGSAP` hook + refs |
| **Scroll animation** | `scroll()` API (native) | ScrollTrigger plugin |
| **Timeline** | `variants` + `stagger` | `gsap.timeline()` |
| **Learning curve** | Shallow — JSX props | Steeper — imperative API |
| **Update frequency** | Active (v12, 2026) | Active |
| **License** | MIT (free) | Standard: free; Business: $599+ |

### Verdict: DO NOT ADD GSAP
Motion (already installed) covers all animation needs for a productivity dashboard:
- **Layout animations**: For kanban card reordering
- **AnimatePresence**: For enter/exit of modals, drawers
- **Drag**: For kanban (complements @dnd-kit)
- **Spring physics**: For micro-interactions
- **Scroll animations**: For timeline view

GSAP would add bundle size, complexity, and a second animation paradigm. Only consider GSAP if you need:
- SplitText for text splitting animations (overkill for a dashboard)
- ScrollTrigger with advanced pinning (not relevant for a desktop app)
- CustomEase for highly specific easing curves (not needed)

---

## 19. Summary: Feature-Need Matrix

| Need | Best Library | Alternative | Status |
|------|-------------|-------------|--------|
| **Dashboard overview cards** | shadcn/ui (Card) + Magic UI (Magic Card) | HeroUI (Card), Animata (widgets) | Not installed |
| **Stat counters (animated)** | Magic UI (Number Ticker) | Animata (Counter/Ticker) | Not installed |
| **Bar/Line/Area charts** | Recharts (direct or via Tremor) | Nivo | Not installed |
| **Donut/ring progress** | Recharts (Pie) + Magic UI (Circular Progress) | Tremor (Progress Circle), Animata (Ring/Dount) | Not installed |
| **Habit contribution calendar** | Nivo (Calendar) | Animata (Weekly Progress widget) | Not installed |
| **Activity timeline** | Animata (Animated Timeline) | shadcn/ui (Data Table) | Not installed |
| **Toast notifications** | Sonner | shadcn/ui (Toast), HeroUI (Toast) | Not installed |
| **Drawer/slide panels** | shadcn/ui (Drawer, wraps Vaul) | HeroUI (Drawer), Tremor (Drawer) | Not installed |
| **Modal/dialog** | shadcn/ui (Dialog) | HeroUI (Modal), Tremor (Dialog) | Not installed |
| **Command palette (⌘K)** | cmdk | shadcn/ui (Command wraps cmdk) | Not installed |
| **Navigation tabs** | Animata (Fluid/Shift Tabs) | shadcn/ui (Tabs), HeroUI (Tabs) | Not installed |
| **Kanban board** | Already using @dnd-kit — stick with it | Kibo UI (Kanban), Dice UI (Kanban) | Already have |
| **Calendar/date picker** | shadcn/ui (Calendar + Date Picker) | HeroUI (Calendar), Tremor (Date Picker) | Not installed |
| **Form inputs** | shadcn/ui (Input, Select, etc.) | HeroUI (Form components) | Not installed |
| **Toggle/switch** | shadcn/ui (Switch) | HeroUI (Switch) | Not installed |
| **Color picker** | Ark UI (Color Picker) | HeroUI (Color Picker) | Not installed |
| **Tags input** | Ark UI (Tags Input) | HeroUI (Tag Group) | Not installed |
| **Bento grid layout** | Magic UI (Bento Grid) | Aceternity UI (Bento Grid), Animata (Bento Grid) | Not installed |
| **Empty states** | shadcn/ui (Empty) | Aceternity UI (Empty States block) | Not installed |
| **Loading/skeleton** | shadcn/ui (Skeleton) | Animata (Skeleton), HeroUI (Skeleton) | Not installed |
| **Theme switcher** | Magic UI (Animated Theme Toggler) | Kibo UI (Theme Switcher) | Not installed |
| **Confetti/delight** | Magic UI (Confetti) | — | Not installed |
| **Sidebar** | shadcn/ui (Sidebar) | Aceternity UI (Sidebar block) | Not installed |
| **Progress bar** | shadcn/ui (Progress) + Magic UI (Circular) | Tremor (Progress/Circle) | Not installed |
| **Pre-built widgets** | Animata (Study Timer, Weekly Progress, etc.) | — | Not installed |

---

## 20. Top Recommendations for Shodasha

### Tier 1: Install Immediately (Highest Impact)

| Library | npm command | Use Case | Priority |
|---------|------------|----------|----------|
| **shadcn/ui** | `npx shadcn@latest init` | Foundation: sidebar, drawer, dialog, table, card, command, toast, skeleton, calendar, forms | **Critical** |
| **Sonner** | `npm install sonner` | Toast notifications for all user actions | **Critical** |
| **cmdk** | `npm install cmdk` | Command palette for app navigation | **High** |
| **Recharts** | `npm install recharts` | Charts: area, bar, line, pie for analytics | **High** |

### Tier 2: Install for Specific Features

| Library | npm command | Use Case | Priority |
|---------|------------|----------|----------|
| **Magic UI** | Copy-paste components | Number Ticker, Circular Progress Bar, Bento Grid, Confetti, Animated Theme Toggler | **High** |
| **Animata** | Copy-paste components | Weekly Progress widget, Study Timer, Animated Timeline, Counter/Ticker, Fluid Tabs | **High** |
| **Nivo** | `npm install @nivo/calendar @nivo/core` | Habit contribution calendar only | **Medium** |
| **Ark UI** | `npm install @ark-ui/react` | Color Picker, Tags Input (if needed) | **Low** |

### Tier 3: Consider for Expansion

| Library | Why |
|---------|-----|
| **Tremor** | Excellent chart wrappers + Tracker component, but may overlap with Recharts + shadcn/ui |
| **HeroUI** | Complete alternative to shadcn/ui — choose one, don't mix both heavily |
| **Aceternity UI** | Primarily marketing/landing page components; use sparingly (Empty States, Bento Grid) |
| **Vaul** | Already consumed via shadcn/ui's Drawer — no direct install needed |

### Architecture Decision: shadcn/ui vs HeroUI

**Recommendation: shadcn/ui**
- Lighter — add only components you need
- Complements the existing Tailwind v4 + Motion stack
- Large ecosystem (blocks, templates, community)
- CLI-based installation is clean and maintainable
- Works well with other libraries (Magic UI, Aceternity, Animata are designed as companions)
- HeroUI is excellent but heavier and more opinionated

### Animation Strategy

**Motion** (already installed) handles all animation needs:
- `AnimatePresence` for all mount/unmount transitions
- `motion.div` with spring physics for micro-interactions
- `layout` prop for kanban reordering
- `useMotionValue` + `useTransform` for animation-driven state
- `prefers-reduced-motion` via `useReducedMotion()`

No GSAP needed. No additional animation library needed.

### Total New Dependencies

```
npm install sonner cmdk recharts
npx shadcn@latest init
npx shadcn@latest add sidebar drawer dialog card table skeleton calendar
npx shadcn@latest add command toast empty badge progress tabs switch
npx shadcn@latest add input select checkbox slider
```

Copy-paste from Magic UI: Number Ticker, Animated Circular Progress Bar, Confetti, Magic Card  
Copy-paste from Animata: Weekly Progress, Study Timer, Animated Timeline, Fluid Tabs  
Optional: `npm install @nivo/calendar @nivo/core` (for habit heatmap)

---

## Appendix: Library Comparison Chart

| Library | Cost | Components | Animation | Access. | Install | Best For |
|---------|------|-----------|-----------|---------|---------|----------|
| shadcn/ui | Free | 60+ | CSS + React Aria | ★★★★★ | CLI | Foundation |
| Tremor | Free | 35+ | Minimal | ★★★★ | npm | Charts |
| Radix UI | Free | 40+ | None (headless) | ★★★★★ | npm | Primitives |
| Ark UI | Free | 45+ | None (headless) | ★★★★★ | npm | Primitives |
| Motion | Free+ | Core API | ★★★★★ | ★★★★ | npm (in) | Animations |
| Sonner | Free | 1 (toast) | ★★★★★ | ★★★★ | npm | Toasts |
| Vaul | Free | 1 (drawer) | ★★★★★ | ★★★★ | npm | Drawers |
| cmdk | Free | 1 (command) | None (headless) | ★★★★★ | npm | Command palette |
| Recharts | Free | 20+ | ★★★ | ★★★ | npm | Charts |
| Nivo | Free | 50+ | ★★★★ | ★★ | npm | Advanced charts |
| Visx | Free | 30+ | None (low-level) | ★★ | npm | Custom viz |
| Aceternity UI | Free+Pro | 200+ | ★★★★★ | ★★★ | Copy-paste | Effects |
| Magic UI | Free+Pro | 150+ | ★★★★★ | ★★★ | Copy-paste | Animations |
| Animata | Free | 154+ | ★★★★ | ★★★★ | Copy-paste | Widgets |
| HeroUI | Free | 71+ | ★★★★ | ★★★★★ | npm | Complete system |
| 21st.dev | Free+Paid | 10k+ | Varies | Varies | AI prompt | Discovery |
