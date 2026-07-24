# Competing Productivity & Habit-Tracking Apps — Research Report

> **Date:** 2026-07-24
> **Purpose:** UI patterns, KPIs, charts, layouts, data models, and design philosophy research for Shodasha.
> **Scope:** Pure research — no code will be written from this document.

---

## Table of Contents

1. [KUBBO](#1-kubbo)
2. [Forest](#2-forest)
3. [Finch](#3-finch)
4. [Habitica](#4-habitica)
5. [LifeUp](#5-lifeup)
6. [Todoist](#6-todoist)
7. [Dailies](#7-dailies)
8. [Cheerly](#8-cheerly)
9. [LifeForge](#9-lifeforge)
10. [MainQuest](#10-mainquest)
11. [Synthesis: Common Patterns & Best Practices](#11-synthesis-common-patterns--best-practices)
12. [What Shodasha Can Learn](#12-what-shodasha-can-learn)

---

## 1. KUBBO

**URL:** https://kubbo.app
**Tagline:** "Your habits build an empire"
**Platform:** iOS, Android, Mac
**Rating:** 4.8 ★ | 30k+ users

### KPIs / Metrics Tracked
- **XP (Experience Points)** — earned per task/habit completion
- **Gold** — currency earned per habit, spent on city building
- **Character Level** — derived from total XP
- **Streaks** — consecutive days of habit completion
- **Weekly completion rate** — tasks completed vs. planned
- **Habit counters** — partial progress (e.g., 6/8 glasses of water)
- **Achievements** — milestone badges

### Layout Structure
- **Dashboard default:** Daily habit list with XP bar at top, character level displayed prominently
- **Tab-based navigation** with bottom bar
- **City builder view** as secondary screen — medieval empire visualization
- **Task types:** Daily habits, counter-type habits (with goals), one-time tasks
- **Cards:** Simple habit cards with toggle/check, XP/Gold earned shown on completion

### Chart Types Used
- **Weekly report cards** — completion rate, tasks done, XP earned, streaks maintained
- **Stats section** — charts for completion rates, best days, consistency patterns
- **XP progress bar** — filling toward next level

### Color Palette & Design Philosophy
- **Dark-first design** — interface built dark-first (habits happen before sunrise/after sunset)
- **Medieval theme** — warm tones, gold accents, stone textures
- **Clean modern UI** underneath the theme — not cluttered
- Philosophy: "Not another checkbox app" — every task is XP, every habit is Gold

### Daily Progress at a Glance
- Today's habit list with checkboxes at top
- XP bar showing progress toward next level
- Quick-view of gold earned today

### Data & Insights
- **Weekly reports** show what was accomplished
- **Stats screen** with charts, streaks, best/worst days
- AI assistant that knows user's patterns and gives personalized tips

### Notification Patterns
- **Smart Reminders** — nudge at right time, not 47 notifications
- Rescheduling missed tasks (no guilt, no broken streak)

### What Makes It Minimalistic Yet Useful
- 30-second setup — no configuration required
- Ready-made game world (medieval empire)
- No penalty for missed days — buildings get buried, easy to restore
- Instant XP + Gold on every action — immediate dopamine loop
- Counter-type habits handle partial progress gracefully

---

## 2. Forest

**URL:** https://forestapp.cc
**Tagline:** "Spend your time well"
**Platform:** iOS, Android, Mac, Browser, Apple Watch
**Rating:** 4.8 ★ | 60M+ downloads
**Since:** 2014

### KPIs / Metrics Tracked
- **Focus time** — total minutes/hours focused
- **Trees planted** — one per completed focus session
- **Tree species count** — variety of trees unlocked
- **Coins earned** — in-app currency from focus sessions
- **Focus streaks** — consecutive days with focus sessions
- **Focus tags breakdown** — time by category (Study, Work, Writing)
- **Real trees planted** — over 2 million funded via Trees for the Future

### Layout Structure
- **Primary view:** The Forest — a visual collection of all trees grown, arranged as a landscape
- **Timer screen** — the core interaction, pick duration + tree species
- **Statistics view** — focus analytics by day/week/month
- **Shop** — spend coins on new tree species and land styles
- **Friend list & leaderboard**
- **Plant Together** — group focus rooms

### Chart Types Used
- **Focus Analytics** — bar charts and line graphs for daily/weekly/monthly focus hours
- **Streak visualization** — calendar-style view
- **Tree collection gallery** — visual collection, not a chart
- **Tag-based breakdown** — donut/pie for time distribution

### Color Palette & Design Philosophy
- **Clean green + white** — natural, calm, organic
- **Seasonal themes** — Spring, Earth Day events
- **Mindful** — "no shame, no preaching, no productivity-bro language"
- Philosophy: "Time well spent, not just saved"

### Daily Progress at a Glance
- **Visible forest** — every focused session as a tree, time made visible
- Total focus time displayed numerically
- Today's tree growing in real-time during focus

### Data & Insights
- Focus patterns by day/week/month
- Breakdown by custom tags
- Streak tracking
- Focus Challenge (daily/monthly missions)

### Notification Patterns
- Gentle encouragement when close to goal
- Soft reset when not — no shame
- Custom Phrases (Pro/Plus) — encouragement during focus
- Ambient sounds for focus (rain, cafe, forest)

### What Makes It Minimalistic Yet Useful
- **Single action** — pick duration, press start
- Visual progress (the tree) replaces data dashboards
- **Consequences have meaning** — tree dies if you quit, not a streak number
- No setup required — works immediately
- **Offline-first** — core focus works without internet
- Free tier genuinely useful

---

## 3. Finch

**URL:** https://finchcare.com
**Platform:** iOS, Android
**Rating:** 4.95 ★ | 730k+ ratings | 650k monthly installs
**Revenue:** ~$1.75M/mo

### KPIs / Metrics Tracked
- **Pet energy** — fills as user completes goals
- **Pet level** — grows over time with care
- **Daily goals completed** — number of self-care exercises done
- **Streaks** — consecutive days of self-care
- **Mood check-ins** — daily mood logging
- **Adventure progress** — pet explores forest based on goal completion
- **In-app currency** (stones/rainbows) — earned from completing goals

### Layout Structure
- **Main dashboard:** Pet front-and-center with energy bar, goal list below
- **Goals list** — scrollable cards with custom self-care "Areas"
- **Pet screen** — interactive companion with animations
- **Shop** — clothes, accessories for pet
- **Adventure map** — pet explores after energized
- **Mood journal** — guided check-ins morning and evening
- **Soundscapes** — background audio for focus/relaxation

### Chart Types Used
- **Energy bar** — links directly to goal completion (not a chart, a status bar)
- **Adventure progress** — map-style progression, not numerical
- **Mood trends** — simple visual mood tracking over time

### Color Palette & Design Philosophy
- **Soft pastels** — gentle pinks, purples, warm tones
- **Cute, comforting** — rounded everything, soft shadows
- Philosophy: "Gentle, shame-free self-care" — no punishment, no streak guilt
- Emotional connection through pet nurturing

### Daily Progress at a Glance
- **Pet's energy bar** — visual indicator of how many goals completed today
- **Goal list** with check-off cards
- **Pet's mood/animation** reflects progress
- Confetti animation on goal completion

### Data & Insights
- Extensive personality quiz during onboarding
- Custom "Areas" for goal organization
- Adventure stories generated from daily completions
- Mood journal entries trackable over time

### Notification Patterns
- Gentle morning check-in prompts
- Evening gratitude reflections
- Pet adventure stories as engagement hooks
- Invite system rewards with in-app currency

### What Makes It Minimalistic Yet Useful
- **Emotional connection** replaces data abstraction — you care for the pet, not a number
- **Low friction** — large tappable cards, minimal typing
- **Layered gamification** — primary loop (pet care) + secondary loops (shop, quests, collections)
- **Forgiving** — no HP loss, no punishment for missed days
- Onboarding creates immediate ownership (hatch pet, name it, choose personality)

---

## 4. Habitica

**URL:** https://habitica.com
**Tagline:** "Gamify Your Life"
**Platform:** iOS, Android, Web
**Rating:** 4.1-4.5 ★ (varies by store)
**Since:** 2013
**Model:** Free (core) + optional subscription (~$4.99/mo)

### KPIs / Metrics Tracked
- **HP (Health Points)** — lost when missing dailies/bad habits
- **XP (Experience Points)** — earned from completing tasks
- **Gold** — earned from completing tasks
- **Level** — character level from XP
- **Mana** — for spells and special actions
- **Class stats** — Warrior, Mage, Healer, Rogue attributes
- **Streaks** — for habits and dailies
- **Equipment & gear** — collected/equipped

### Layout Structure
- **Dashboard:** 3-bucket layout — Habits, Dailies, To-Dos
- **Avatar panel** — character display with stats
- **Party system** — group quests with friends
- **Guild system** — interest-based communities
- **Challenge system** — community competitions
- **Rewards screen** — gear shop, custom rewards
- **Tavern** — social hub

### Chart Types Used
- **XP bar** — progress toward next level
- **HP bar** — current health status
- **Mana bar** — for spellcasting
- **Streak counters** — numerical, not visual charts
- **Stats display** — numerical attribute scores

### Color Palette & Design Philosophy
- **8-bit retro RPG aesthetic** — pixel art, medieval fantasy
- **Dark backgrounds, bright UI elements**
- Philosophy: "Real life as a role-playing game"
- The game layer IS the feature, not decoration

### Daily Progress at a Glance
- **Today's Dailies list** — tasks due today
- **HP, XP, Mana bars** at top of screen
- Streak counts next to habits
- Check-off turns green with sound effect

### Data & Insights
- Basic task completion history
- Level progression as primary progress indicator
- Class evolution based on stat distribution

### Notification Patterns
- Daily reminder (configurable)
- HP loss warnings
- Party quest progress updates
- Challenge deadlines

### What Makes It Minimalistic Yet Useful
- NOT minimalistic — this is the deepest, most complex RPG system
- **Social accountability** (parties, guilds) is the killer feature
- **Open source** — community-driven features
- Three-bucket task system is genuinely well-designed
- Reward system is fully customizable (create your own rewards)

---

## 5. LifeUp

**URL:** https://lifeup.ulives.io | docs at https://docs.lifeupapp.fun
**Platform:** Android (primary) | iOS via ulives (LifeUp 2.0)
**Rating:** 4.6 ★ | 273k+ downloads
**Model:** One-time purchase (~$3.99) | No ads

### KPIs / Metrics Tracked
- **Attributes** — fully customizable (default: user-defined skills like Coding, Fitness)
- **XP (Experience Points)** — per task/habit
- **Coins** — virtual currency
- **Level** — overall character level
- **Streaks** — habit streaks
- **Skills** — custom skills leveled independently
- **Achievements** — custom unlock conditions
- **Feelings** — mood/emotion logging per task

### Layout Structure
- **Dashboard:** Task list with RPG elements overlaid
- **Character sheet** — attributes, level, skills
- **Shop** — buy custom rewards with coins
- **Inventory** — items collected
- **Achievements screen** — custom conditions
- **World module** — social sharing of items/configs
- **Pomodoro timer** — integrated focus tool
- **Feelings tracker** — mood logging

### Chart Types Used
- **Detailed statistics** — thorough analytics but customizable
- **Progress bars** — toward next level/skill up
- **History logs** — event-based timeline
- **Exportable data** — JSON/CSV for external analysis

### Color Palette & Design Philosophy
- **Material Design 3** — modern, clean Android aesthetic
- **Customizable theme colors** — dozens of options
- **Dark mode** included
- Philosophy: "Customizable RPG sandbox" — you build your own system
- Fantasy elements are optional — appeals to non-D&D users too

### Daily Progress at a Glance
- Today's task/habit list with completion status
- XP earned today display
- Current level + progress to next
- Widgets for home screen

### Data & Insights
- **Extremely customizable** stats and analytics
- World module for sharing configurations
- Feelings/history per task
- Google Drive/Dropbox/WebDAV sync

### Notification Patterns
- Standard Android notifications
- Reminders for tasks and habits
- No aggressive notification system

### What Makes It Minimalistic Yet Useful
- **Offline-first** — works without internet
- **No subscriptions** — one payment, done
- **Extreme customization** — define your own skills, rewards, achievements, loot boxes
- Material Design UI looks like a normal app (not a game) — lower barrier for non-gamers
- Steep learning curve but immense flexibility

---

## 6. Todoist

**URL:** https://todoist.com
**Platform:** iOS, Android, Web, Windows, macOS, Linux
**Rating:** 4.7+ ★ | 50M+ users | 19+ years old
**Model:** Free + Pro ($4/mo) + Business ($6/mo)

### KPIs / Metrics Tracked
- **Karma points** — earned from completing tasks, using advanced features
- **Karma level** — Beginner → Novice → Intermediate → Professional → Expert → Master → Grand Master → Enlightened
- **Daily goal** — user-set task completion target
- **Weekly goal** — user-set task completion target
- **Streaks** — consecutive days/weeks meeting goals
- **Karma Trend** — line graph of points over last week
- **Tasks completed** — total count

### Layout Structure
- **Today view** — tasks due today (default landing)
- **Upcoming view** — calendar-style task overview
- **Projects & sections** — hierarchical organization
- **Labels & filters** — custom categorization
- **Team workspace** — shared projects
- **Productivity view** — Karma dashboard with trend graph
- **Quick Add** — natural language input bar

### Chart Types Used
- **Karma Trend line graph** — daily points over past week
- **Productivity streaks** — calendar view showing completion
- **Task completion counts** — simple numerical display

### Color Palette & Design Philosophy
- **Clean white + accent red** (the famous red dot)
- **Minimalist Scandinavian design** — Doist's design language
- Philosophy: "Clarity, finally" — reduce cognitive load
- Professional, neutral, non-gimmicky

### Daily Progress at a Glance
- **Today view** — all tasks due today with checkboxes
- **Daily goal progress** — "3/10 tasks done" counter
- **Karma display** — current level badge
- **Streak indicator** — fire icon + days count

### Data & Insights
- Karma point history (1-week line graph)
- Task completion trends (basic)
- Daily/weekly goal compliance
- Platform does NOT do deep behavior analysis — intentionally simple

### Notification Patterns
- Smart reminders (time-based, location-based)
- Daily/weekly goal updates
- Karma summary (configurable)
- Very customizable notification control

### What Makes It Minimalistic Yet Useful
- **Natural language input** — fastest task entry in the market
- **Keyboard shortcuts** everywhere
- **Not gamified for gamification's sake** — Karma is optional, not the core
- Template system for quick starts
- Integrations with everything (Zapier, Google Calendar, Slack, etc.)
- Karma is widely seen as a "relic" — users either love it or disable it immediately

---

## 7. Dailies

**URL:** https://dailieshabit.com | iOS: https://apps.apple.com/us/app/dailies-track-habits-rewards/id6502421000
**Platform:** iOS, Android
**Rating:** 4.5 ★
**Model:** Free + Premium subscription

### KPIs / Metrics Tracked
- **Coins** — earned for completing habits, goals, skills
- **XP (Experience Points)** — earned per achievement
- **Level domains** — Health, Wealth, Mind, Social (4 stat categories)
- **Streaks** — habit completion chains
- **Personas** — unique character archetypes based on how you live
- **Skill hours** — tracked per skill with mastery milestones
- **Goal progress** — deadline-based with incremental tracking

### Layout Structure
- **Habit list** — daily/weekly/monthly habits
- **Goal tracker** — deadline-based goals with progress
- **Skill tracker** — hour logging with mastery levels
- **Focus Timer** — coin-earning pomodoro sessions
- **Rewards shop** — spend coins on custom rewards
- **Stats & charts** — rich analytics
- **Challenges** — built-in (100 Envelope, 10K Steps, reading, language)
- **Social habits** — shared habits with friends/partners

### Chart Types Used
- **Rich stats and charts** — app store mentions beautiful charts
- **Calendar-style history** — for reading/language tracking
- **Level progression** — visual per domain
- **Persona evolution** — visual transformation

### Color Palette & Design Philosophy
- **Polished dark mode** — day and night use
- Modern design with premium themes
- Philosophy: "Turn your life into a game"

### Daily Progress at a Glance
- Today's habit list with Quick Actions for important habits
- Streak display
- XP/coins earned today
- Urgent Matters section for time-sensitive tasks

### Data & Insights
- Rich stats and charts for patterns
- Persona system that evolves based on tracked behavior
- Cloud-synced data with export capability
- Privacy-respecting notifications

### Notification Patterns
- One-time or repeating reminders (daily/weekly/monthly)
- Local notifications (no server-side)
- Organized by category, priority, urgency

### What Makes It Minimalistic Yet Useful
- **Persona system** — unique differentiator, character evolves based on real behavior
- Social habits with friends (shared accountability)
- Multiple habit types: simple, counter, multi-step
- Build/quit distinction for habits
- Premium themes allow personalization

---

## 8. Cheerly

**URL:** https://cheerly.app
**Tagline:** "Your AI Wellness Adventure"
**Platform:** iOS, Android
**Rating:** 4.8 ★ | 100k+ adventurers

### KPIs / Metrics Tracked
- **Daily habit completion** — tracked across 4 focus areas
- **Story progression** — generative AI creates narrative chapters from daily logs
- **Spirit animal growth** — companion evolves with user
- **Focus areas** — Creativity, Mood, Organization, Social Connection
- **Personality traits** — from onboarding quiz (Introvert/Extrovert, Blunt/Tender, Planner/Spontaneous)

### Layout Structure
- **Home screen** — daily quote, ongoing stories, quests waiting
- **Spirit animal screen** — interactive companion
- **Focus area selection** — pick a domain for curated habits
- **Daily journal/story** — AI-generated narrative from activities
- **Personality quiz** — onboarding determines spirit animal
- **World themes** — Cozy Forest, Deep Space, Ocean Calm

### Chart Types Used
- **Minimal charts** — the app de-emphasizes data visualization in favor of narrative
- Progress is shown through **story chapters**, not graphs
- UI color shifts dynamically based on AI analysis of user patterns

### Color Palette & Design Philosophy
- **Warm, soothing pastels** — cozy, inviting
- **Dynamic UI theming** — colors shift based on user's journals and habits
- Philosophy: "Growth becomes a happy adventure"
- Tamagotchi for the soul — companion-based motivation

### Daily Progress at a Glance
- The companion's state reflects daily progress
- Daily quotes and ongoing story chapters
- Quest list for today

### Data & Insights
- **AI-powered** — analyzes journals to understand patterns
- **Third-person narrative** — every day logged becomes a story chapter
- Personality adapts tone, habits, themes to user patterns
- NPC encounters and choice moments shape what happens next

### Notification Patterns
- Gentle daily prompts
- Story-based engagement (cliffhanger chapters)
- Companion interactions

### What Makes It Minimalistic Yet Useful
- **Narrative instead of numbers** — progress is a story, not a chart
- Personality-driven adaptation makes it feel personal
- No setup of complex game mechanics
- Focus areas provide structure without rigidity
- AI generates the story — user just does the habits

---

## 9. LifeForge

**URL:** https://lifeforge.app
**Tagline:** "The version of you you keep promising — show up"
**Platform:** iOS, Android, Web
**Rating:** 4.6 ★ (Google Play) | 5.0 ★ (App Store)
**Model:** Free (no ads) + Premium (£2.99/mo optional)

### KPIs / Metrics Tracked
- **6 Stats (S.T.R.I.V.E.):** Strength, Vitality, Agility, Intelligence, Willpower, Charisma
- **XP** per stat — earned independently per activity
- **Level** — overall character level
- **Class** — evolves based on dominant stats (15+ classes)
- **Streaks** — with consequences (stat decay)
- **Rust** — stat decay mechanic when inactive
- **Quests completed** — Main Quest (recommended, +50% XP) vs Side Quests
- **Relics** — permanent rewards for completing quest arcs

### Layout Structure
- **Home screen** — mentor conversation (AI-powered plain-text logging)
- **Character sheet** — 6 stats displayed, current class
- **Class evolution tree** — visual progression path
- **Quest log** — AI recommends Main Quest based on weakest stat
- **Mentor screen** — 14 mentors, each with unique voice, 8 languages
- **VS quests** — competitive quests against friends
- **Settings/Profile**

### Chart Types Used
- **Stat bars** — 6 independent progress bars
- **Class evolution** — tiered visualization (Tier 1 → Tier 2 → Tier 3)
- **Stat decay visualization** — rust accumulates visually
- **Calendar/streak view** — daily consistency shown

### Color Palette & Design Philosophy
- **Dark mode default** — modern, game-like dark theme
- **RPG stat UI** — reminiscent of Skyrim or modern RPGs
- Philosophy: "Your character levels up when you do"
- No ads, no BS — minimal monetization

### Daily Progress at a Glance
- **Mentor greeting** — conversational check-in
- **Main Quest recommendation** — "do this first for +50% XP"
- **6 stat bars** — see which stats need attention (rust/decay)
- **Today's streak status**

### Data & Insights
- **AI-powered logging** — type what you did in plain English, AI assigns XP to correct stats
- **Apple Health / Health Connect integration** — steps, sleep, workouts auto-convert to XP
- Stat decay creates real stakes without guilt
- Quest arcs tell multi-step stories
- Mentor remembers past conversations and follows up

### Notification Patterns
- **Human-like check-ins** — mentor follows up like a person, not a marketing bot
- Gift passes (share premium with friends)
- No "we miss you!" marketing bot energy

### What Makes It Minimalistic Yet Useful
- **Plain-text AI logging** — no checkboxes, no categories, just describe what you did
- **6 stats are comprehensive but not overwhelming**
- **Class evolution** gives a sense of identity and progression
- **Stat decay** creates meaningful stakes (unlike most apps)
- **Forgiving** — no guilt-tripping, just pick back up
- Actual game mechanics (classes, relics, mentor conversations) not just skinned checkboxes

---

## 10. MainQuest

**URL:** https://mainquest.net
**Tagline:** "Level up your life, one quest at a time"
**Platform:** iOS, Android, Web
**Rating:** New (3,000+ heroes)
**Model:** Free (open beta, no ads)

### KPIs / Metrics Tracked
- **XP (Experience Points)** — per quest completion
- **Level** — character level
- **Gold** — in-game currency
- **HP (Health Points)** — lost when missing daily quests
- **Mana** — for spells (QuickCast actions)
- **Class attributes** — INT, STR, CHR, DEX, VIT
- **Streaks** — daily quest chains
- **Focus time** — pomodoro/flowmodoro sessions that earn XP
- **Achievements** — milestone badges

### Layout Structure
- **Quest log** — daily quests (cycle at 3 AM boundary), one-off quests
- **Character sheet** — class, attributes, level
- **Inventory** — items, coins, hero customization
- **Focus Timer** — built-in pomodoro
- **Leaderboard** — global competition
- **Parties** — co-op accountability groups
- **Story mode** — weekly narrative chapters tied to factions

### Chart Types Used
- **Advanced Analytics** — on roadmap (not yet built)
- **Stat bars** — for class attributes
- **Streak visualization** — fire/chain indicators

### Color Palette & Design Philosophy
- **Modern dark theme** — clean, contemporary UI
- **RPG-themed but not pixelated** — modern game aesthetic
- Philosophy: "Designed for ADHD brains" — quick wins, instant dopamine, clear priorities
- Positive-only rewards on some systems (no shame)

### Daily Progress at a Glance
- **Surge Mode** — stack 5 small quests for quick dopamine
- Today's daily quest list
- Current HP, XP, Mana status
- Streak status

### Data & Insights
- Basic analytics available; Advanced Analytics coming (Q2 2026)
- Focus timer logs productivity sessions
- Quest completion history

### Notification Patterns
- Standard push notifications
- HP warnings when missing dailies
- Party quest updates

### What Makes It Minimalistic Yet Useful
- **ADHD-first design** — instant XP feedback on every action, short-loop quests, forgiving mechanics
- **3 AM day boundary** — one bad day doesn't erase a month of progress
- **Streak Protection spells** (uses Mana)
- **No paywalls** — free during open beta
- **Offline support** on mobile
- **Focus Timer** integrated (Pomodoro + Flowmodoro)

---

## 11. Synthesis: Common Patterns & Best Practices

### 11.1 The Core Loop (Across All Apps)

```
Complete task → Earn reward (XP/coins/energy) → See progress (level up/city grows/pet happy) → Stay motivated → Complete more tasks
```

Every successful app has an **immediate feedback loop** — the gap between action and reward is <1 second.

### 11.2 KPI Categories

| Category | Metrics | Used By |
|---|---|---|
| **Effort-based** | XP, Points, Karma | Nearly all |
| **Currency-based** | Gold, Coins, Stones | KUBBO, Habitica, LifeUp, Dailies, Forest |
| **Status-based** | Level, Class, Rank | All RPG-style apps |
| **Health-based** | HP, Energy, Mana | Habitica, MainQuest, Finch |
| **Time-based** | Focus hours, Sessions | Forest, MainQuest, LifeUp |
| **Consistency-based** | Streaks, Chains | Nearly all |
| **Attribute-based** | STR/INT/etc., Skills | LifeForge, LifeUp, Dailies |
| **Real-world impact** | Real trees planted | Forest (2M+ trees) |

### 11.3 Chart Types That Work

| Chart Type | Best For | Used By |
|---|---|---|
| **Progress bar** | Level/XP toward next milestone | All RPG apps |
| **Visual collection** | "Forest" of trees, city buildings | Forest, KUBBO |
| **Story/narrative** | Emotional engagement | Cheerly, Finch |
| **Stat bars (radial)** | Multi-attribute tracking | LifeForge (6 stats) |
| **Streak calendar** | Consistency at a glance | Habitica, Todoist, Loop |
| **Line graph** | Trends over time (7/30 day) | Todoist (Karma Trend), Forest |
| **Bar chart** | Daily/weekly completion | KUBBO (weekly report) |
| **Donut/pie** | Category breakdowns | Forest (tag analysis) |

**Key finding:** The most effective progress indicators are NOT traditional charts — they are **visual metaphors** (a forest, a city, a pet, a character) that replace numerical abstraction with tangible, emotional progress.

### 11.4 Layout Patterns

1. **Dashboard-first** — the default view is the most important action (today's tasks)
2. **Bottom tab navigation** — 4-5 tabs, universal pattern
3. **Character/avatar top-left** — personalization and identity
4. **Stats as secondary screen** — not the default, but accessible
5. **Quick-add floating** — FAB or prominent input, natural language preferred

### 11.5 Design Philosophies Mapped

| Philosophy | Apps | Approach |
|---|---|---|
| **RPG deep** | Habitica, LifeForge, MainQuest | Full game mechanics: classes, HP, gear, parties |
| **Gentle self-care** | Finch, Cheerly | Companion-based, no punishment, narrative-driven |
| **Visual metaphor** | Forest, KUBBO | Progress shown as growing/building something |
| **Professional minimal** | Todoist | Gamification is optional, not core |
| **Custom sandbox** | LifeUp | User builds their own game system |

### 11.6 The "At a Glance" Problem — How They Solve It

| Approach | Example | How It Works |
|---|---|---|
| **Single visual** | Forest | One screen shows ALL trees = lifetime of focus |
| **Living metaphor** | KUBBO | City grows as you do — glance tells you everything |
| **Companion state** | Finch | Pet's mood = how your day is going |
| **Stat bars** | LifeForge | 6 bars show which areas need attention |
| **XP bar** | Habitica | One bar shows progress toward next level |
| **Today list** | Todoist | Clean checkbox list — zero interpretation needed |

**Best practice:** The glance should communicate **two things**: (1) Have I done enough today? (2) Am I making progress over time?

### 11.7 Forgiveness vs. Punishment

| Approach | Apps | Effect |
|---|---|---|
| **No punishment** | Finch, Cheerly, Forest | Low anxiety, high long-term retention |
| **Stat decay** (rust) | LifeForge | Creates stakes without shaming |
| **Restorable setback** | KUBBO (buried buildings) | Forgiveness + mild consequence |
| **HP damage** | Habitica, MainQuest | High stakes, can cause avoidance |
| **Neutral** | Todoist, LifeUp | No consequence, no urgency |

**Trend in 2026:** The industry is moving AWAY from punishment mechanics and toward **positive reinforcement + gentle accountability**. Apps that were punishment-heavy (Habitica) are now being contrasted by forgiveness-first alternatives (Gamified Lives, Finch).

### 11.8 AI Integration Patterns

| AI Feature | Apps |
|---|---|
| **Natural language logging** | LifeForge, KUBBO |
| **Generative narrative** | Cheerly (story chapters from daily logs) |
| **Coach/personalized tips** | KUBBO (AI habit coach) |
| **Personality-driven adaptation** | Cheerly (dynamic UI, tone) |
| **Mentor conversations** | LifeForge (AI mentors with memory) |
| **Smart scheduling** | Todoist (natural language input) |

---

## 12. What Shodasha Can Learn

### 12.1 Design Principles to Adopt

**1. Replace charts with visual metaphors.**
   - Don't show a bar chart of "habits completed" — show something growing (a garden, a structure, a landscape)
   - The most glanced-at apps (Forest, Finch) use living metaphors, not dashboards

**2. Default view = Today's action list.**
   - Every successful app shows today's tasks as the primary screen
   - Stats and insights are secondary, navigated-to screens

**3. Make progress visible in under 1 second.**
   - The glance must communicate: "How am I doing today?"
   - This can be a progress ring, a character's state, a bar, or a visual collection

**4. Remove punishment mechanics.**
   - The 2026 trend is clear: shame and HP loss cause avoidance
   - Use stat decay (LifeForge) or restorable setbacks (KUBBO) instead

**5. One primary currency + one progression metric.**
   - Complex systems (multiple currencies, multiple XP types) confuse
   - Best apps have 1-2 clear metrics: XP + Gold, Energy + Coins

### 12.2 Data Model Insights

**Entity relationship pattern across apps:**
```
User → Habits/Tasks/Quests → Completions → XP/Currency → Rewards/Level-ups → City/Pet/Character updates
```

**Store everything as events** — every habit completion is a timestamped event. This enables:
- Heatmap generation
- Streak calculation
- Trend analysis
- "This time last year" comparisons

### 12.3 Chart & Visualization Recommendations for Shodasha

| View | Recommended Chart | Why |
|---|---|---|
| **Daily progress** | Circular progress ring + habit list | Quick glance, shows % complete |
| **Weekly summary** | Small bar chart (7 bars) | Clear day-over-day comparison |
| **Consistency** | Calendar heatmap | Shows patterns without overplotting |
| **Category breakdown** | Horizonal stacked bar | Compare effort across domains |
| **Long-term trend** | Line chart (30-day rolling avg) | Smooth out daily noise |
| **Mood/energy** | Area chart | Shows emotional/physical trends |
| **Streak** | Fire icon + number + mini-calendar | Status symbol + proof |

### 12.4 Dashboard Layout Recommendation

```
┌─────────────────────────────────────────────────┐
│  ┌──────┐  ┌─────────────────────────────────┐ │
│  │Avatar│  │  Today's Date + Greeting         │ │
│  │Level │  │  "You've completed 4/8 habits"   │ │
│  │  42  │  │  [Progress ring ── 50%]          │ │
│  └──────┘  └─────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  Habit 1 [✓]    ● ● ● ● ○ ○ ○                  │
│  Habit 2 [  ]   ○ ○ ○ ○ ○ ○ ○   ← weekly mini  │
│  Habit 3 [✓]    ● ● ● ● ● ● ●   heatmap per    │
│  Habit 4 [✓]    ● ○ ● ● ● ○ ○   habit row      │
│  Habit 5 [  ]   ○ ○ ○ ○ ○ ○ ○                  │
├─────────────────────────────────────────────────┤
│  Quick stats row: [Streak: 12d] [XP +250] [..]  │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Main visual │  │  Recent insights /       │ │
│  │  (city/tree/ │  │  next recommendation     │ │
│  │  garden/etc) │  │  "Your best day is Tue!" │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 12.5 Feature Prioritization (What Matters Most)

| Priority | Feature | Evidence |
|---|---|---|
| P0 | One-tap habit completion | Universal across all apps |
| P0 | Immediate feedback (XP/animation) | Every app has this |
| P0 | Streak tracking | Universal |
| P0 | Today as default view | Universal |
| P1 | Visual metaphor for progress | Forest, KUBBO prove this drives retention |
| P1 | Smart reminders (not spam) | Users cite bad notifications as #1 churn reason |
| P1 | Weekly summary/report | KUBBO, Forest, Todoist all have this |
| P2 | AI/natural language logging | LifeForge, KUBBO (differentiator) |
| P2 | Social accountability | Habitica's parties prove this works |
| P2 | Custom rewards | LifeUp, Dailies |
| P3 | Punishment mechanics | Trend is away from these |
| P3 | Leaderboards | Only in competitive apps |

### 12.6 What NOT to Do

1. **Don't make the user configure a game system before starting** — LifeUp's biggest weakness
2. **Don't use HP loss or streak-breaking as primary motivation** — causes avoidance
3. **Don't show a blank dashboard on first launch** — every app pre-populates with examples
4. **Don't require typing for every interaction** — tap targets > text input
5. **Don't over-notify** — users tolerate 1-2 meaningful notifications per day max
6. **Don't put stats front-and-center** — they are reference, not motivation

### 12.7 Final Synthesis

The most successful habit apps in 2026 share a common architecture:

1. **Immediate reward** for every action (XP, animation, visual change)
2. **Today-first** default view
3. **Visual metaphor** for progress (not raw charts)
4. **Forgiving** of missed days (no shame)
5. **Low friction** data entry (tap > type)
6. **Smart, minimal notifications**
7. **Free core loop** (monetize extras, not essentials)

Shodasha should differentiate through:
- A **unique visual metaphor** (not a forest, not a city, not a pet — something ownable)
- **AI-powered pattern recognition** that surfaces insights without being asked
- **Category-specific visualizations** (Board vs Habits vs Timeline vs Dashboard each need different chart types)
- **Professional minimalism** (unlike the RPG apps, Shodasha targets professionals who want data without Dungeons & Dragons)
- **Cross-domain insight** — the killer feature is connecting data across domains (habits affect mood affect productivity) in ways single-domain apps cannot

---

*End of research document.*
