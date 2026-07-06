---
name: BiliBall
description: Friend-group billiards tracker. Private leagues, bold leaderboards, real rivalry.
colors:
  tournament-blue: "#2660a4"
  match-amber: "#c47335"
  chalk-amber: "#f19953"
  felt-brown: "#56351e"
  felt-mist: "#e8f5ee"
  break-white: "#edf7f6"
  surface: "#ffffff"
  surface-secondary: "#f5f5f5"
  ink-primary: "#1a1a1a"
  ink-secondary: "#666666"
  ink-tertiary: "#999999"
  border-light: "#e5e5e5"
  border-subtle: "#f0f0f0"
  success-light: "#16a34a"
  danger-light: "#e74c3c"
  hall-night: "#2d2640"
  hall-surface: "#3d3550"
  lavender-text: "#e2e0f0"
  steel-text: "#99a1a6"
  celadon: "#a8c69f"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.tournament-blue}"
    textColor: "{colors.break-white}"
    rounded: "{rounded.md}"
    padding: "13px 16px"
  button-primary-hover:
    backgroundColor: "#1e4f8a"
    textColor: "{colors.break-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tournament-blue}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger-light}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
  card-section:
    backgroundColor: "rgba(255,255,255,0.75)"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  player-row-first:
    backgroundColor: "{colors.tournament-blue}"
    textColor: "{colors.break-white}"
    rounded: "{rounded.md}"
    padding: "12px"
---

# Design System: BiliBall

## 1. Overview

**Creative North Star: "The Pool Hall Leaderboard"**

BiliBall's design language comes from a specific physical object: the framed scoreboard on the wall of a real pool hall. Legible at a glance. Bold enough to hold across a dim room. Unambiguous about who's winning. Every screen is built around this premise — the data is the decoration, and rankings are the emotional core, not an afterthought.

The palette runs two channels: a cool Competition Blue for structure and authority (nav, primary buttons, the leader's row), and a warm Amber-to-Brown register for texture and secondary hierarchy (rank labels, section cues, body copy). The page background is a faint green-tinted mist — a nod to the felt without being literal about it. The dark mode swaps in a deep hall-night indigo that feels like the pool bar after 10pm: purple-black ground, lavender text, celadon green accents.

This system is RTL-native, Hebrew-first. Spatial hierarchy, reading flow, and all component layouts are built right-to-left. Bilingual coexistence is not retrofitted; it's the starting point.

**Key Characteristics:**
- Bold ranked lists are the primary emotional surface
- Two-temperature palette: cool blue authority + warm amber texture
- Flat-by-default elevation; borders and background tints create separation
- Mobile-first, 480px primary column
- Light and dark modes are equal citizens — neither is "the real one"
- RTL layout native; LTR never assumed

## 2. Colors: The Pool Hall Palette

Competition Blue leads. Amber adds warmth and hierarchy. Together they read "sport" without reading "fitness app."

### Primary
- **Tournament Blue** (`#2660a4`): The structural color. Nav bar, first-place player row, primary CTA buttons, pending banners, and any surface that carries authority. Bold, direct, competition-grade.
- **Break White** (`#edf7f6`): Text and icon color on Tournament Blue surfaces. A very slightly seafoam-tinted near-white — not pure `#fff`, which reads clinical against the blue.

### Secondary
- **Match Amber** (`#c47335`): The texture color. Section labels, rank numbers, divider lines, secondary button borders, timestamps. Never used at full saturation on large surfaces — it creates hierarchy without commanding the eye.
- **Chalk Amber** (`#f19953`): Warmer, lighter orange. The first-place rank numeral, avatar warm-tone variant. Signals heat and urgency above Match Amber.

### Tertiary
- **Felt Brown** (`#56351e`): Dark umber used as rich body text in light mode. Warm near-black — more interesting than `#1a1a1a` on the felt-mist background, and still readable at body sizes.

### Neutral — Light Mode
- **Felt Mist** (`#e8f5ee`): Page background in light mode. A low-chroma green-tinted surface — pool table felt at a distance, not a punchline. Too subtle to name, too deliberate to be generic off-white.
- **Surface** (`#ffffff`): Card and content surfaces. The pure white reads clean against Felt Mist.
- **Surface Secondary** (`#f5f5f5`): Outer body/shell background behind the content column.
- **Border Light** (`#e5e5e5`): Standard separators and card borders.

### Neutral — Dark Mode
- **Hall Night** (`#2d2640`): Dark mode base. Deep indigo-purple — the pool bar after 10pm. Not neutral-dark-gray; not pitch black. The purple warms it.
- **Hall Surface** (`#3d3550`): Dark card and panel backgrounds. One step lighter than Hall Night.
- **Lavender Text** (`#e2e0f0`): Primary text in dark mode. Slightly warm-purple tint; reads soft against the indigo ground.
- **Steel Text** (`#99a1a6`): Secondary text in dark mode. Gray-steel, no hue push.
- **Celadon** (`#a8c69f`): Dark mode accent. Muted green — the felt makes an appearance. Used where Tournament Blue leads in light mode (primary buttons, active nav states).

### Semantic
- **Success** (`#16a34a` light / `#a8c69f` dark): Win counts, positive scores.
- **Danger** (`#e74c3c` light / `#e07070` dark): Loss counts, negative scores, destructive actions.

**The Two-Temperature Rule.** Every screen balances cool (blue, indigo) against warm (amber, brown). Never all cool (clinical), never all warm (muddy). Tournament Blue sets the structure; Match Amber finds the details.

**The Break-White Rule.** Text on Tournament Blue is always `#edf7f6`, never `#ffffff`. Pure white on this blue reads as an oversight. The 0.5% seafoam tint is the intention.

## 3. Typography

**Display / Body Font:** System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

**Character:** Native system fonts only — no custom typeface loaded. This is intentional: the app feels like part of the phone, not a designed artifact. Speed and crispness over brand distinctiveness via typography. The design personality lives in color and layout, not letterforms.

### Hierarchy
- **Display** (700, 24px, 1.2): Big numbers, invite codes, win totals. Data as identity.
- **Headline** (700, 20px, 1.3): Screen-level empty state titles. Used sparingly.
- **Title** (700, 16px, 1.4): Nav logo, important button labels. The loud-and-clear tier.
- **Body** (400–500, 14px, 1.5): Main content — player names, game descriptions, button copy.
- **Label** (500, 12px, 1.4): Secondary names, compact data cells, small-context text.
- **Caption** (700, 10px, 1.3): Stat column headers, rank markers. Tight and functional.

**The No-Eyebrow Rule.** Section labels must not use `text-transform: uppercase` + wide `letter-spacing` as a recurring scaffold. Uppercase tracking was appropriate once on the Invite section; applied to every section header it becomes AI grammar, not voice. Replace with a simple color shift (Match Amber at body weight) or omit entirely when the content is self-labeling.

**The RTL-Native Rule.** All typography, spacing, and layout decisions are authored right-to-left first. `direction: rtl` is set at body level and inherited. No LTR overrides unless a specific Latin-script element requires it.

## 4. Elevation

Flat by default. Surfaces separate by background color and thin borders, not by shadow. A 0.5px border at `rgba(match-amber, 0.15)` creates the cards; a tonal step from page background to surface white creates hierarchy.

**The One Shadow Exception.** The pending-games banner earns a real shadow (`0 2px 8px rgba(38,96,164,0.25)`) because it is an interruption — a notification demanding attention. It must float above the content stream. No other surface gets a shadow at rest.

**The Inset-Only Rule for Decorative Effects.** The billiard ball avatars use inset shadows to simulate a 3D sphere. These are decorative, not structural, and belong to that specific component only. Do not apply inset shadows to cards, buttons, or inputs.

## 5. Components

### Buttons
Solid and direct. Buttons are commitments; the design should say so.

- **Shape:** Gently curved (8px radius). Not pill-shaped — that's playful-tech. Not sharp — that's enterprise.
- **Primary:** Tournament Blue fill (`#2660a4`), Break White text (`#edf7f6`), 13px vertical / 16px horizontal padding. Full width in single-action contexts.
- **Hover / Focus:** Darken to `#1e4f8a`. No scale animation — the button shouldn't bounce.
- **Ghost:** Transparent fill, 1px border at `rgba(tournament-blue, 0.3)`, Tournament Blue text. Used for secondary choices alongside a primary button.
- **Danger / Leave:** Transparent fill, 1px danger-color border, danger-color text. Explicit but not alarming until tapped.
- **Dark mode:** Primary becomes Celadon (`#a8c69f`) with Hall Night text. Ghost border shifts to hall-border; text shifts to Lavender.

### Bottom Navigation
The fixed bottom bar is a primary surface, not an afterthought.

- **Height:** 56px
- **Background:** `rgba(255,255,255,0.92)` in light mode; Hall Night in dark
- **Center action ("Add Game"):** Wider tab (1.4× flex), full Tournament Blue fill, Break White text. The positive action visually dominates the bar.
- **Side tabs:** Match Amber at rest, Felt Brown when active. Icon at 18px, label at 9px.
- **Separator:** 0.5px top border at `rgba(match-amber, 0.2)`

### Section Cards
Content containers that organize the leaderboard, recent games, and invite sections.

- **Background:** `rgba(255,255,255,0.75)` — slightly translucent over the Felt Mist page background.
- **Border:** `0.5px solid rgba(match-amber, 0.15)` — a warm whisper of separation.
- **Radius:** 8px
- **Margin:** 8px (creates visible Felt Mist gaps between sections)
- **Dark mode:** Hall Surface background, hall-border stroke.

### Player Rows
The core list item. Two visual tiers.

- **First place:** Full Tournament Blue panel, 12px padding all around, Chalk Amber rank numeral at 22px. Player name in Break White at title weight. Stats in green (win) / red (loss) at 16px. The leader row IS the hero.
- **Other ranks:** White surface, 10px vertical padding with 0.5px amber bottom border. Rank in Match Amber caption weight. Name in Felt Brown (label weight). Stats in compact green/red at 12px.

### Ball Avatars
The signature custom component.

- **Shape:** Perfect circle with inset highlight (`inset -2px -2px 5px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.3)`), a white ellipse pseudo-element for the light catch.
- **Inner stripe:** White circle (55% diameter) centered, with player initial in dark gray at caption size. This replicates the solid pool ball's stripe/number band.
- **Colors:** 8 ball-colors cycling by rank — blue, yellow, red, green, orange, purple, cornflower, black.
- **Medal badge:** Emoji medal positioned bottom-right on the ball wrap for top-3 players.

### League Chip (Dropdown Trigger)
- Rounded-full pill on the nav bar; `rgba(white,0.18)` background, `rgba(white,0.3)` border, Break White text. Minimal footprint on the blue nav.

### Bottom Sheet (Modal)
- Background: `#edf7f6` (light) / Hall Night (dark). Rounded top corners (8px). Handle bar at top: 36px wide, 4px tall, `rgba(match-amber, 0.3)`.

## 6. Do's and Don'ts

### Do:
- **Do** make the leaderboard the boldest surface on the screen. Rankings carry emotional weight; they deserve visual weight.
- **Do** use Tournament Blue for structural authority: nav, primary actions, the leader's row. It signals "this matters."
- **Do** use Match Amber for secondary hierarchy: labels, rank numbers, timestamps. It's texture, not focal point.
- **Do** write RTL-native: design all spacing, icon placement, and text alignment for right-to-left from the start.
- **Do** keep the Felt Mist page background (`#e8f5ee`). It creates a pool-table-adjacent warmth without being a theme park.
- **Do** treat Break White (`#edf7f6`) as the only text color on Tournament Blue. Never `#ffffff` on that blue.
- **Do** size the "Add Game" bottom nav tab wider than its siblings — the primary action must command the bar.

### Don't:
- **Don't** use ring charts, progress streaks, or motivational banners. BiliBall is not a fitness app. This is rivalry and bragging rights, not self-improvement. The design must never read Strava or Nike Run Club.
- **Don't** apply `text-transform: uppercase` with wide `letter-spacing` to every section header. That pattern is AI-generated scaffolding, not voice. Use it once, deliberately, or not at all.
- **Don't** add motivational copy ("Keep pushing!", "Great streak!"). The data speaks. Let it.
- **Don't** use gradient text (`background-clip: text`) anywhere. Decorative, never meaningful.
- **Don't** use thick colored side-stripe borders (border-left or border-right greater than 1px as an accent on cards or list items). Rewrite as full border or background tint.
- **Don't** use shadow on more than one surface at rest. The pending-games banner is the one exception; it earned it.
- **Don't** apply Celadon (`#a8c69f`) in light mode. It belongs to the dark mode palette only, where it substitutes for Tournament Blue.
- **Don't** treat the billiard ball avatar inset shadows as a general design pattern. They are specific to that component.
