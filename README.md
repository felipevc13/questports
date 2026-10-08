# QuestPorts 🥽

> **The standalone VR database for ports, emulators & injections. Zero PC required.**

QuestPorts is a centralized directory and knowledge base cataloging classic source ports, VR injections, and emulators that run **100% natively on Meta Quest hardware** (Quest 2, Quest 3, Quest 3S) without requiring a PC or streaming.

---

## ✨ Features

* **Zero PC Required:** Dedicated solely to standalone Quest experiences.
* **Instant Folder Mappings:** Accurate storage paths (e.g. `/sdcard/RTCWQuest/main/`) with one-click copy shortcuts.
* **Curated Installation Guides:** Step-by-step instructions in Markdown with prerequisites and troubleshooting tips.
* **Hardware & 6DoF Filtering:** Filter by headset model (Quest 2, 3, 3S), category, status, and developer (Team Beef, amwatson, etc.).
* **Media & Gameplay:** In-depth YouTube gameplay embeds and links to official stores (Steam/GOG) and APK repositories.

---

## 🛠️ Tech Stack

* **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3, SSR/Nitro)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism Dark Theme
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL 17 with Row Level Security)
* **Hosting:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/felipevc13/questports.git
cd questports
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-publishable-or-anon-key
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Simulated Quest (install flow)

One-click install uses WebUSB/ADB and needs a headset. For local testing, open any page with `?mockQuest=1`. A simulated Quest 3 appears, and a small panel lets you switch headset, install, and “files on device” states. Visitors without that query are unchanged. See [TESTING.md](TESTING.md).

---

## 🗄️ Database Setup (Supabase)

Run `supabase/full_setup.sql` in your Supabase SQL Editor to initialize the `ports` table, enums, RLS policies, and initial seed data.

Headset checks live in `port_verifications` (one row per check). Apply `supabase/migrations/20261008220000_port_verifications.sql` in the SQL editor on an existing project. The public API can only read `approved` rows. Browsers cannot insert.

Server environment (Vercel, never `NEXT_PUBLIC` / Nuxt `public`):

* `SUPABASE_SERVICE_ROLE_KEY` — one-click install reports and the admin form write through this key.
* `VERIFICATION_ADMIN_SECRET` — required header for `POST /api/admin/verifications`. The unlisted form is `/admin/verify`.

A copy-paste SQL check is in `supabase/manual_verification.sql`. A catalog badge stays current only while `tested_version` still matches `ports.latest_version` (a leading `v` does not matter). The daily GitHub sync updates `latest_version`; the badge goes stale from that alone.

---

## 📄 License & Disclaimer

Built with ❤️ by and for the VR community. Meta Quest is a registered trademark of Meta Platforms, Inc. All source ports belong to their respective developers.
