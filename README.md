# Ultimate Todo App

A comprehensive, feature-rich todo list built with pure HTML, CSS, and vanilla JavaScript. Combines the best ideas from 8 different todo implementations into one polished app — no frameworks, no build step, just open `index.html` and go.

## Features

### Core
- Add, edit, delete tasks (CRUD)
- Mark tasks complete / incomplete
- Persistent storage via `localStorage`
- Real-time counters — Total / Active / Completed / Overdue

### Editing
- **Inline double-click edit** — double-click any task text to edit it in place; Enter saves, Escape cancels
- **Modal edit** — click the pencil icon for a full-screen edit dialog
- 200-character limit with validation toasts

### Filtering & Sorting
- Filter tabs: All / Active / Completed / Overdue / High Priority
- Category filters: General / Work / Personal / Shopping / Health / Finance / Learning
- Sort by: Date Created / Priority / Due Date / A–Z / Category
- Live search with instant results

### Visual & UX
- Dark / Light theme toggle (preference saved to `localStorage`)
- Live clock in header — updates every second
- Fall animation when a task is deleted
- Smooth toast notifications for every action
- Drag-and-drop reordering (order persisted)
- Grid view / List view toggle
- Custom scrollbar

### Advanced
- Priority levels: High / Medium / Low (colour-coded badges)
- Due dates with overdue detection
- Notes field per task
- Bulk select mode — complete, delete, or set priority on multiple tasks at once
- Clear Completed / Delete All (with confirmation)
- JSON data export / backup
- Keyboard shortcuts

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Enter` | Add task |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + T` | Toggle theme |
| `Ctrl/Cmd + B` | Toggle bulk select |
| `Ctrl/Cmd + D` | Delete all |
| `Escape` | Close modal / cancel bulk |
| Double-click task | Inline edit |

## Getting Started

```
1. Clone or download this repo
2. Open index.html in any modern browser
3. Start adding tasks
```

No npm, no build step, no server required.

## File Structure

```
ultimate-todo-app/
├── index.html     — markup and layout
├── styles.css     — all styles, CSS variables, themes, animations
├── script.js      — AdvancedTodoApp class, full app logic
└── README.md
```

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, keyframe animations)
- Vanilla JavaScript ES6+ (class, Set, destructuring, async patterns)
- Font Awesome 6 (icons)
- Google Fonts — Inter

## Browser Support

Chrome 70+, Firefox 65+, Safari 12+, Edge 79+, iOS Safari, Chrome Mobile

## License

MIT
