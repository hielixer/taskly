# Taskly

A simple, fast task tracker built with **vanilla HTML, CSS and JavaScript**. No frameworks, no build step, just open `index.html`.

**[Live demo](https://hielixer.github.io/taskly/)**

## Features

- Add, complete, edit (double-click) and delete tasks
- Filter by All / Active / Completed
- Tasks persist in the browser via `localStorage`
- Light and dark theme (follows your system preference, with a manual toggle)
- Responsive layout and keyboard-friendly, with accessible labels
- Safe rendering: user input is inserted as text, never as HTML

## Getting started

```bash
git clone https://github.com/hielixer/taskly.git
cd taskly
```

Then open `index.html` in your browser. To serve it locally instead:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Project structure

```
taskly/
├── index.html   # Markup
├── style.css    # Styling and theming (CSS variables)
├── script.js    # App logic and state
└── README.md
```

## What I practiced

- DOM manipulation and event handling without a framework
- Persisting state with `localStorage` (with graceful fallbacks)
- Theming with CSS custom properties
- Basic accessibility: labels, focus styles, `aria-live` updates

## Ideas for next steps

- Due dates and priorities
- Drag-and-drop reordering
- Unit tests for the task logic
- Deploy with GitHub Pages

## License

MIT
