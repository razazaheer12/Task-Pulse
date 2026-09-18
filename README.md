<div align="center">

# ⚡ TaskPulse

### A calm, local-first task manager for focused days, no sign-in required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-task--pulse--webapp.netlify.app-7c3aed?style=for-the-badge&logo=netlify&logoColor=white)](https://task-pulse-webapp.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

<img width="931" height="431" alt="image" src="https://github.com/user-attachments/assets/c8fe62b2-2a36-422f-8e00-fc54400da554" />


---

## 📌 Overview

**TaskPulse** is a minimalist, local-first task management progressive web app (PWA) built with Next.js 16, React 19, and TypeScript. It is designed with a singular purpose — helping you stay focused on what matters most, without distractions, accounts, or cloud lock-in.

All your data lives directly in your browser via `localStorage`. There is no backend, no database, and no sign-in required. TaskPulse is installable as a native-like app on any device and works fully offline.

> *"A calm space for your most important work."*

---

## ✨ Features

### 🗂️ Task Management
- **Add, edit, and delete tasks** with a frictionless composer interface
- **Double-click any task** to enter inline edit mode
- **Mark tasks complete** with an animated checkbox
- **One-click clear** to remove all completed tasks
- **Persist across sessions** — all tasks survive browser refreshes via `localStorage`

### 🎯 Priority System
- Assign every task one of three priority levels: **High**, **Medium**, or **Low**
- Each priority is colour-coded with a distinct pill badge:
  - 🔴 **High** — rose tint
  - 🟡 **Medium** — amber tint
  - 🔵 **Low** — sky tint

### 🔍 Smart Filtering
- Filter the task list by **All**, **Active**, or **Completed** with live counts displayed on each tab
- Filter state is reactive — updates immediately without re-renders

### 📊 Progress Tracker
- Real-time **progress bar** showing percentage of tasks completed
- Live counters for active vs. completed tasks in the hero stat block

### 🌅 Dynamic Greeting & Date
- Greets the user by name with a **time-aware message** computed client-side:
  - *Good morning* · 12:00 AM – 11:59 AM
  - *Good afternoon* · 12:00 PM – 5:59 PM
  - *Good evening* · 6:00 PM – 11:59 PM
- Date is formatted using the browser's **local timezone and locale** (no UTC drift)
- Fully SSR-safe — implemented in a dedicated `Greeting.tsx` client component using `useEffect` to prevent Next.js hydration mismatches

### 👤 Personalised Onboarding
- First-time visitors are welcomed with a clean **onboarding screen**
- Enter your name once → stored in `localStorage` → displayed on every visit
- No accounts, no passwords, no tracking

### 🎨 Dark / Light Theme
- Ships with a refined **dark theme** (deep navy + violet accents) by default
- Toggle to a soft **light theme** from the options menu
- Theme preference is persisted in `localStorage` across sessions
- Ambient gradient orbs add depth to the background on both themes

### 📲 Progressive Web App (PWA)
- Fully installable on **desktop and mobile** via the browser's native install prompt
- Install button appears in the top bar when the PWA install event is available
- A **Service Worker** (`sw.js`) caches the app shell for offline-first access with a stale-while-revalidate strategy
- `manifest.json` configured with name, icons, theme colour, and standalone display mode

### ♿ Accessibility
- All interactive elements have `aria-label` attributes
- Filter tabs implement `role="tablist"` / `role="tab"` / `aria-selected`
- Menu implements `role="menu"` / `role="menuitem"`
- Focus-visible outlines on all focusable elements
- Reduced-motion media query disables all transitions for users who prefer it

### 📱 Responsive Design
- Adaptive layout from 320 px wide mobile to full desktop
- Mobile-specific overrides: stacked hero, wrapped composer, hidden keyboard hints

---

## 🏗️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) | 16.3.3 |
| **UI Library** | [React](https://react.dev/) | 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.7.3 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.3 |
| **Animation** | [tw-animate-css](https://github.com/jamiebuilds/tw-animate-css) | 1.4.0 |
| **Icons** | [Lucide React](https://lucide.dev/) | 1.17 |
| **UI Primitives** | [@base-ui/react](https://base-ui.com/) | 1.5 |
| **Component toolkit** | [shadcn/ui](https://ui.shadcn.com/) | 4 |
| **Class utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | latest |
| **Persistence** | Browser `localStorage` | — |
| **PWA** | Web App Manifest + Service Worker | — |
| **Analytics** | [@vercel/analytics](https://vercel.com/analytics) | 1.6.1 |
| **Package Manager** | [pnpm](https://pnpm.io/) | 12 |

---

## 📁 Project Structure

```
Task-Pulse/
├── app/
│   ├── globals.css          # Global styles, CSS custom properties, dark/light themes, responsive layout
│   ├── layout.tsx           # Root layout: metadata, viewport, Vercel Analytics
│   └── page.tsx             # Main application shell (onboarding, dashboard, task engine)
│
├── components/
│   ├── Greeting.tsx         # Client-only component: dynamic time-based greeting + locale date
│   └── ui/
│       └── button.tsx       # Accessible, variant-based button primitive (shadcn + base-ui)
│
├── lib/
│   └── utils.ts             # cn() utility — merges clsx + tailwind-merge class names
│
├── public/
│   ├── manifest.json        # PWA web app manifest
│   ├── sw.js                # Service Worker: cache-first offline strategy
│   ├── icon.svg             # App icon (SVG)
│   ├── apple-icon.png       # Apple touch icon
│   ├── icon-dark-32x32.png  # Favicon (dark)
│   └── icon-light-32x32.png # Favicon (light)
│
├── next.config.mjs          # Next.js config (unoptimised images, TypeScript build relaxation)
├── tsconfig.json            # TypeScript project config
├── postcss.config.mjs       # PostCSS config for Tailwind v4
└── package.json             # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** (recommended), or npm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/razazaheer12/Task-Pulse.git

# 2. Navigate into the project directory
cd Task-Pulse

# 3. Install dependencies
pnpm install
# or
npm install
# or
yarn install
```

### Running Locally

```bash
# Start the development server
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Create an optimised production build
pnpm build

# Start the production server
pnpm start
```

---

## 🖥️ Usage

1. **First Visit** — You'll see the onboarding screen. Enter your name and click **Get Started**.
2. **Dashboard** — Your personalised greeting, live date, and task workspace appear.
3. **Add a Task** — Type in the composer, choose a priority level, and press **Enter** or click **+**.
4. **Complete a Task** — Click the checkbox on any task row.
5. **Edit a Task** — Double-click the task title to enter inline edit mode. Press **Enter** to save or **Escape** to cancel.
6. **Delete a Task** — Hover a task to reveal the action buttons, then click the trash icon.
7. **Filter Tasks** — Click **All**, **Active**, or **Completed** tabs above the list.
8. **Toggle Theme** — Open the **⋯** menu → *Use light / dark mode*.
9. **Install as App** — Click **Install app** in the top bar (when your browser supports it).
10. **Reset** — Open the **⋯** menu → *Reset app data* to clear everything and start fresh.

---

## 🔒 Privacy & Data

TaskPulse is **100% local-first**. There is:

- **No server** receiving your tasks or name
- **No account** required
- **No cookies** or third-party tracking
- **No sync** — your data stays on your device in `localStorage`

The only external call is Vercel Analytics in production (anonymous page-view telemetry). All task data, your name, and theme preference are stored exclusively under the following `localStorage` keys:

| Key | Contents |
|---|---|
| `taskpulse-todos` | JSON array of all tasks |
| `taskpulse-user-name` | Your display name |
| `taskpulse-theme` | `"dark"` or `"light"` |

---

## 🌐 Deployment

The live demo is deployed on **Netlify**:

🔗 **[https://task-pulse-webapp.netlify.app/](https://task-pulse-webapp.netlify.app/)**

The project is compatible with any static/serverless hosting that supports Next.js:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- Any Node.js host

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Author 

<div>

Built with focus, calm, and ☕ by [Raza Zaheer](https://github.com/razazaheer12)

**[⬆ Back to top](#-taskpulse)**

</div>
