# Ultimate Todo App

![Vanilla JS](https://img.shields.io/badge/vanilla-JS-f7df1e)
![No build step](https://img.shields.io/badge/build-none-brightgreen)
![Storage](https://img.shields.io/badge/storage-localStorage-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive, feature-rich todo list built with pure HTML, CSS, and vanilla JavaScript. Combines the best ideas from 8 different todo implementations into one polished app — no frameworks, no build step, just open `index.html` and go.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Tech Stack](#tech-stack)
- [Browser Support](#browser-support)
- [License](#license)
- [About](#about)

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

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
