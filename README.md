# Rock • Paper • Scissors — Modern

A polished, single‑file Rock–Paper–Scissors game featuring a theme switcher, ripple interactions, keyboard shortcuts, a win modal with confetti, and a celebratory sound effect. Built with plain HTML, CSS, and JavaScript—no dependencies.

- Technology: HTML + CSS + Vanilla JS
- Files: Single `index.html`
- Status: Ready to run locally (no build step)

## Features

- Multiple themes with persistence: Neon, Glass, Sunset
- Win experience: trophy modal, confetti animation, and a short Web Audio jingle
- Keyboard shortcuts: R / P / S, Enter/Space on focused buttons, Esc to close modal
- Interactive touches: ripple feedback on choices, subtle panel highlights
- Accessible defaults: live result updates, dialog semantics, motion‑reduction support
- Responsive layout: looks great on mobile and desktop

## Quick Start

1) Download or copy `index.html` (the provided file).
2) Open it directly in your browser (double‑click). No server required.

Optional local server:
- Python: `python -m http.server 8080`
- Node (serve): `npx serve .`
- Visit: http://localhost:8080

## How to Play

- Click Rock, Paper, or Scissors—or press R / P / S on your keyboard.
- The result appears instantly and scores update.
- On a win, a modal pops up with confetti and a sound. Close via the button or Esc.

Keyboard shortcuts:
| Action                | Shortcut      |
|----------------------|---------------|
| Choose Rock          | R             |
| Choose Paper         | P             |
| Choose Scissors      | S             |
| Activate focused btn | Enter / Space |
| Close win modal      | Esc or click backdrop |

Other controls:
- Reset score: “↺ Reset score”
- Change theme: “🎨 Theme” (persists via localStorage)

## File Structure

- `index.html` — contains all markup, styles, and scripts.

## Configuration and Customization

Sound (on/off):
- In `index.html`, toggle:
```js
const SOUND_ON = true; // set to false to mute the win jingle
```

Use a custom audio file (optional):
```js
function playWinJingle() {
  const audio = new Audio('win.mp3'); // place file next to index.html
  audio.volume = 0.6;
  audio.play().catch(() => {});
}
```
Notes: Browsers require a user interaction before playing audio. On iOS, ensure Silent mode is off.

Themes:
- Default theme is set on the body element:
```html
<body class="theme-neon"> <!-- use theme-glass or theme-sunset -->
```
- To add a theme, create a CSS block (e.g., `.theme-cyberpunk { ... }`) and add it to the `themes` array:
```js
const themes = [
  { cls: "theme-neon", label: "Neon" },
  { cls: "theme-glass", label: "Glass" },
  { cls: "theme-sunset", label: "Sunset" },
  // { cls: "theme-cyberpunk", label: "Cyberpunk" },
];
```

Confetti intensity:
- Adjust the count in:
```js
spawnConfetti(els.confetti, 36); // increase for more confetti
```

Text, labels, and emojis:
- Result messages: `showResult()`
- Win modal text: `openWinModal(reason)`
- Choice emojis and names: `EMOJI` map and button markup

## How It Works

- CPU move: random from `["rock", "paper", "scissors"]`
- Outcome:
```js
const RULES = { rock: "scissors", paper: "rock", scissors: "paper" };
function decide(player, cpu) {
  if (player === cpu) return "draw";
  return RULES[player] === cpu ? "win" : "lose";
}
```
- UI updates:
  - Scores: `updateScores(outcome)`
  - Panel states: `setPanels(outcome)`
  - Result text: `showResult(outcome, player, cpu)`
  - On win: `openWinModal(reason)` + `playWinJingle()`

Storage:
- Theme choice persists using `localStorage` under key `rps-theme`.

## Accessibility

- Live region: `aria-live="polite"` for result announcements
- Win modal: `role="dialog"` with `aria-modal="true"`, backdrop click and Esc to close
- Focus: moves to “Next Round” on modal open
- Motion: respects `prefers-reduced-motion` (disables confetti/animations where appropriate)

Tip: For complex dialogs, consider adding a focus trap if you expand functionality.

## Browser Support

- Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
- Visuals use `color-mix()` and `backdrop-filter`; in older browsers, the UI gracefully degrades.

## Troubleshooting

- No sound:
  - Ensure `SOUND_ON = true`
  - Trigger a user interaction first (click/tap)
  - iOS: disable Silent mode
- Confetti not visible:
  - System “Reduce Motion” may be enabled
- Theme doesn’t persist:
  - localStorage may be blocked or disabled

## Roadmap (Ideas)

- Best‑of‑N match mode
- Lizard–Spock variant
- Persistent high score / stats
- PWA (installable) support
- SVG or icon set instead of emojis

## License

MIT — free to use, modify, and distribute.

## Credits

- Design and implementation: single‑file HTML/CSS/JS
- Emojis: native Unicode glyphs
- Built to be lightweight, accessible, and easy to customize