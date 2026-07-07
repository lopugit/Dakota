# Screens spec

All screens share: content column `max-width: 680px`, centered; page gutter 20px mobile / 32px desktop; 16px gap between cards; screen header = Newsreader 30px/500/−0.015em title + 14px muted subtitle. Cards: `--surface-card`, 1px `--border-subtle`, radius 14, `--shadow-sm`, padding 20px. List rows inside cards: 1px hairline dividers, ~11-13px vertical padding. Section labels ("kickers"): 11px/600, letter-spacing 0.08em, uppercase, `--text-muted`. Screens enter with a 200ms ease-out 8px rise (no opacity animation).

## Navigation shell
- **Mobile (<900px)**: fixed bottom tab bar — 5 slots: Today (sun), Diary (calendar-days), Foods (carrot), Feed (newspaper), More (menu). 86% `--surface-card` + 12px backdrop blur, 1px top hairline, safe-area padding. Active tab: 2px ink dash above icon, weight 600, ink color; inactive muted. Min target 52px.
- **More** opens a bottom sheet (scrim: 45% ink + 3px blur; sheet: card bg, radius 20 top, `--shadow-lg`, 200ms rise): 3-col grid of Treatments (leaf), Learn (book-open), Practices (sprout), Wisdom (moon), Care (heart), Profile (user) + Theme toggle row.
- **Desktop (≥900px)**: sticky left rail 240px, card bg, right hairline: wordmark ("Macrobiotica", Newsreader 21px/500) + mono date; groups — [Today, Diary], "Explore" [Foods, Treatments, Learn, Practices, Wisdom], "Circle" [Feed, Care, Profile]; group headers = kicker style at `--text-faint`. Active item: `--surface-sunken` pill, radius 10. Theme toggle pinned at rail bottom.
- Mobile header (mobile only): wordmark left, ThemeToggle right.

## 1 · Today
Subtitle = written-out date ("Thursday, July 3").
- **Season banner** card: sun icon, "High summer — fire season" (14px/600) + one-line guidance (13px muted), 陽 kanji right in Newsreader 26px `--text-faint`.
- **Balance today** card: kicker + mono day-average ("+0.10"); full BalanceMeter with label ("Near centre — balanced"; if |avg|>0.25 the label suggests gently); divider; "Check-ins" kicker + primary button "Rate my balance now" toggling an inline panel: live label + mono value, range slider −1…+1 step 0.05 (accent color), "Yin 陰 / centre / 陽 Yang" scale captions, optional note input, Cancel/Save. Saved check-ins list: mono time · colored dot (value→chakra color) · signed mono value · note.
- **Meals** card: kicker "Meals · N" + secondary button "Log a meal" toggling inline search picker (input + scrollable result rows: name, mono prep time, small meter). Logged rows: mono time, name, 110px mini meter, chevron → meal detail.
- **Today's practice** card: 38px circled icon, kicker + practice name + one-liner, buttons "Mark done"→"Done today" + ghost "All practices". Practice rotates daily (day-of-year % practices).
- **This week** card: 7 columns (weekday letter, day-average dot, tiny mono value), today outlined; each column links to that day in Diary; ghost "Open diary".

## 2 · Diary
- **Calendar** card: month header (Newsreader 20px) with chevron prev/next + "Today" ghost button; M-S column headers; day cells (min 48px): mono day number (faint if out-of-month), day-average dot below; selected = sunken bg; today = focus-ring border. Caption: "Dot colour is the day's average — violet toward yin, red toward yang, green at centre."
- **Day detail** card: date title (Newsreader 22px) + mono average (or "nothing logged"); BalanceMeter when data exists; "Check-ins" rows (time/dot/value/note); "Meals" rows (time/name/mini-meter, tap → meal detail); "Practices kept" as green badges.

## 3 · Foods (search + browse + two detail views)
- **List**: search input (placeholder "Search foods and meals — try pumpkin soup"); filter chips All/Meals/+7 categories (active chip inverts to ink); "Meals" section card (name, time·season, meter, chevron) then "Foods" card (name, category, meter). Empty state card: "Nothing here for '<q>'" + gentle line. Footer caption: "Left is yin 陰 · right is yang 陽 · centre is balance".
- **Food detail**: ghost back "← All foods"; header card (Newsreader 26px name + category badge, BalanceMeter + note paragraph); **"How preparation moves it"** card — for Raw/Blanched/Steamed/Sautéed/Long-simmered/Pickled: method name + signed mono shift, small meter at shifted value, one-line note; "In meals" chip links.
- **Meal detail**: back + primary "Log this meal today"; header card (name Newsreader 26px, time + season badges, description, "Whole-meal balance" kicker + mono value + full meter); **Ingredients** card (rows: name, mono amount, 100px meter, optional note; tap → food detail); **Process and order** card (numbered steps: text + signed mono energy effect + note; total row "Net effect of preparation" + caption "The same shopping list cooked differently lands in a different place — the pot decides."); **Notes from cooks** card (avatar initials, name, comment).

## 4 · Treatments
- **List**: search ("Search ailments — try cold hands, bloating, sleep"); system chips (All, Digestion, Energy, Sleep, Circulation, Skin, Mind, Cycles); rows: ailment name + system, pattern badge (violet badge = yin pattern, red = yang, neutral = mixed), chevron. Footer disclaimer caption.
- **Detail**: back; header card (name + pattern badge + system badge; signs as small bullet list); **Favour** card (food/meal rows with why-line; linked rows open meal detail); **Home remedies** card (name + how); combined card: "Supporting practices" chips (→ Practices), "Ease off" badges, italic Newsreader closing note, disclaimer line.

## 5 · Learn
- **List**: "Continue" raised card (kicker, lesson title Newsreader 28px, course·lesson meta, primary "Continue lesson"); 4 course cards (title Newsreader 20px + mono "n of m", 4px accent progress bar, lesson rows: done-dot (accent-filled or outlined), title (muted when done), mono minutes, chevron).
- **Reader**: back "← All courses"; article card (28px pad): kicker course, title Newsreader 32px, mono meta; body max-width 56ch — paragraphs 15px/1.75; H3 Newsreader 22px; pull-quotes Newsreader italic 19px centered with top/bottom hairlines; bullet lists with 5px accent dots; asides in sunken 10px-radius panel; footer: "Mark complete"→"Completed" + ghost "Next: <lesson>".

## 6 · Practices
Accordion cards: 38px circled icon, name + frequency badge + green streak badge ("n-day streak"), one-liner, chevron-down/up. Expanded: numbered steps, italic Newsreader "why" line, Mark done/Done today button. Footer: "Practice, not perfection — a kept streak is a bonus, not a duty."

## 7 · Feed
- **Composer** card: kicker "Share from today", input, chips to attach one of today's meals, primary "Share".
- **Post** cards: 36px initials avatar, name, mono relative time; body 14.5px; optional attached-meal panel (sunken, soup icon, name, mini meter → meal detail); like row (heart + mono count, accent when liked; message-circle + count); comments (24px avatars, bold name + text); inline comment input + "Post".

## 8 · Care
- **List** card: friend rows — initials avatar, name, "relation · constitution", 100px meter, chevron.
- **Friend detail**: back "← Everyone"; header card (52px avatar, name Newsreader 26px, relation badge + green constitution badge, BalanceMeter, "Past seven days" mini bar chart — height=|value|, color=direction, last bar full opacity + caption); "Cooking for <name>" card (guidance paragraph + italic personal note); "Meals that would suit this week" chips (computed: lean-yin friend → grounding meals, lean-yang → cooling, centred → near-centre).

## 9 · Wisdom
Sub-tab chips: Five elements / Organ clock / Astrology / Glossary + search input (filters current tab).
- **Elements**: rows per element — colored dot (chakra token), name Newsreader 20px, organs; 2×2+ grid of Season/Taste/Emotion/Foods mini-fields.
- **Organ clock**: rows — mono hour range, organ (14px/500), note; current 2-hour window highlighted sunken + green "now" badge.
- **Astrology**: "Your chart" card (birth-year number input → live Chinese zodiac: "Metal Monkey" Newsreader 28px, Yin/Yang polarity badge, animal note, element line); "This year" card (2026 — the Fire Horse 丙午 + guidance paragraph).
- **Glossary**: rows — term Newsreader 18px + definition 13.5px/1.6.

## 10 · Profile
- **Identity** card: 56px initials avatar, display name Newsreader 24px (fallback "Your profile"), mono "practising since June 2026", green constitution badge; "Display name" labeled input.
- **Stats** card: 4-col grid — mono 22px numbers (day streak, check-ins, meals logged, lessons done) + 11px muted labels.
- **Settings** card rows: Theme (+ toggle; caption "Light is yang, dark is yin."), Daily check-in reminder (Switch), Share progress to feed (Switch).
- Ghost "Sign out" centered.
