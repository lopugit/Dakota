# Macrobiotica app — UI kit

The core product: a mobile app (390px design width) for learning and maintaining macrobiotic practice.

## Screens
- **TodayScreen** — daily balance meter, meal log (breakfast/lunch/dinner), today's practice.
- **LearnScreen** — continue-lesson card, course list with progress.
- **FoodsScreen** — food energetics reference: search, category chips, yin↔yang position per food.
- **CareScreen** — people you cook for, each with their own balance; add-person dialog.

All four are exported from the design-system bundle and composed from the reusable components (Card, Button, Tag, BalanceMeter, Dialog, …). Shell chrome (header, tab bar, section labels, row lists) lives in `app.css` — kit-only, not part of the global `styles.css` closure.

## Entry points
- `index.html` — full interactive app: switch tabs, toggle light/dark, log dinner (moves the balance), filter foods, add a person.
- The Today screen is also available as a consumable template: `templates/today/Today.dc.html`.

## Conventions shown
- Header title in Newsreader; date as an 11px caps kicker; ThemeToggle top-right.
- The 2px chakra spectrum hairline runs across the very top of the app — the one rainbow moment per screen.
- Bottom tab bar: Lucide icons at 1.75px stroke (2px when active), 11px labels, blur + translucent card background.
- Meal/food rows: 14px semibold title, 12px muted sub, mono values for yin/yang numbers.
