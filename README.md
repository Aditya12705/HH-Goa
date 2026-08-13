# HH Goa 2026 — Frame Studio

> **Official PFP Frame & Builder Pass Generator** for Hacker House Goa 2026 Open Trials (Task #1)

Create your Hacker House Goa 2026 identity in seconds. Upload any photo, pick a frame style, customize your builder profile, download a high-res graphic, and share it on X — all in your browser, no accounts needed.

🌴 **Live:** [GitHub Pages](https://aditya12705.github.io/HH-Goa/) &nbsp;|&nbsp; 🏠 **Event:** [hhgoa.com](https://hhgoa.com) &nbsp;|&nbsp; 📝 **Apply:** [Devfolio](https://hacker-house-goa-2026.devfolio.co/)

---

## ✦ Task #1 Feature Checklist

| Requirement (from hhgoa.com) | Status |
|---|---|
| ✦ Instantly recognizable HH Goa 2026 identity | ✅ Official palette, wordmark, गोवा badge, sunrise art |
| ✦ 1-click download + 1-click Share to X | ✅ Download PNG + Share modal + Web Share API on mobile |
| ✦ Works on any photo — no manual cropping | ✅ Drag-to-reposition, zoom, rotate, auto-fit masks |
| ✦ Personalized: name, stack, a generated builder class | ✅ Name, role, location, tech stack chips, 35+ builder titles |
| ✦ Seconds from upload to shareable output | ✅ Real-time canvas preview, instant download |
| ✦ Use #FrameInGoa to get featured | ✅ Hashtag in frame + share caption |

## ✦ Features

### Frame Formats
- **PFP Frame Overlay** (2000×2000) — profile-picture-ready with 4 mask shapes
- **VIP Builder Pass** (1600×2000) — boarding-pass style ID card with builder details

### Photo Controls
- Upload: drag-drop, file picker, selfie camera capture, sample photo
- Supports **JPG, PNG, WebP, HEIC** (iPhone photos auto-converted)
- Zoom, Rotate, Position X/Y with live preview
- 4 mask geometries: Quad, Squircle, Circle, Arch
- 4 color filters: Normal, Goa Sun (warm), Cyber (posterize), B&W (jungle green duotone)

### Builder Identity
- Name, Role, Location/Squad
- Randomizable Builder Title Banner (35+ Goa-themed titles)
- Tech Stack chips (luggage-tag style)
- Pass Status Badge (passport-stamp aesthetic)

### Export & Share
- High-resolution PNG download (2000×2000 or 1600×2000)
- X/Twitter share modal with pre-filled caption
- Mobile: native share sheet via Web Share API (passes PNG directly)

### Landing Page
- Full event-themed landing mirroring hhgoa.com structure
- Animated marquee ticker with event facts
- 4-day agenda cards (Genesis → Triangle → Build → Launch)
- Animated stat counters
- Roadmap timeline
- FAQ accordion
- Closing CTA with Devfolio application link

## ✦ Tech Stack

**Plain HTML + CSS + Vanilla JavaScript** — no framework, no build step, no npm.

```
/
├── index.html           (single page with all sections)
├── THEME.md             (documented palette/type/assets)
├── css/
│   ├── base.css         (tokens, reset, typography, components)
│   ├── landing.css      (hero, marquee, agenda, stats, FAQ, footer)
│   └── studio.css       (generator tool styles)
├── js/
│   ├── main.js          (nav, scroll, counters, FAQ)
│   ├── studio.js        (upload, controls, canvas interaction)
│   ├── canvasExport.js  (Format A & B canvas composition)
│   ├── builderClass.js  (builder title generator)
│   └── share.js         (X share modal + Web Share API)
├── bgData.js            (base64 canvas backgrounds)
└── assets/
    ├── Hacker house.png (wordmark)
    ├── Sun rise.png     (hero art)
    ├── footer trees.png (treeline)
    ├── agenda.png       (workspace illustration)
    ├── details.png      (roadmap illustration)
    ├── hackers.png      (builders illustration)
    └── frames/          (reserved for future SVG frames)
```

## ✦ Local Preview

```bash
# Option 1: Any static file server
npx serve .

# Option 2: Python
python -m http.server 8000

# Option 3: Just open the file
# Open index.html directly in your browser
```

## ✦ Privacy

- **Zero backend** — no server, no database, no analytics
- **No uploads** — all photo processing happens on-device in the browser
- Photos never leave your machine except when you explicitly download/share

## ✦ Credits & Disclaimer

This is an independent/fan-built tool for the **Hacker House Goa 2026 Open Trials** (Task #1: Frame / ID Card Generator). The "Hacker House", "HH Goa", and "2:47 PM Studio" marks belong to their respective owners. Brand palette, typography, and section structure reference the official [hhgoa.com](https://hhgoa.com) identity as the task explicitly requires theming around the event.

**GOA, INDIA · 28–31 OCT 2026 · 247 SEATS**

*"less noise. more signal."*
