# Project Brief: QuestPorts

## 1. Overview & Value Proposition

* **Project Name:** QuestPorts (`questports.vercel.app`)
* **Tagline:** *The standalone VR database for ports, emulators & injections. Zero PC required.*
* **Objective:** Build a centralized catalog (wiki/database) of unofficial game experiences for Meta Quest that run **100% natively on headset hardware (standalone)**, eliminating any dependency on PCs, cables, or Wi-Fi streaming (PCVR).
* **Problem Statement:** Lack of standardized technical curation. SideQuest prioritizes indie games and App Lab titles without solving friction points of classic ports (where to copy original files, Steam requirements, per-headset compatibility). Newer developments (injections, wrappers, community ports) are fragmented across Discord servers, Reddit threads, and GitHub repositories.

---

## 2. Scope & Content Categories

The platform catalogs four core standalone project categories:

1. **Source Ports:** Classic game engines recompiled for ARM/Android with native OpenXR and 6DoF controller support (e.g., *RTCWQuest, Lambda1VR / Half-Life, Doom 3 Quest*).
2. **VR Injections / Wrappers:** Stereoscopic 3D camera injection into Android builds or modern native ports (e.g., *Red Dead Redemption 1 standalone, GTA San Andreas*).
3. **VR Emulators:** Emulators featuring native VR or stereoscopic 3D output (e.g., *CitraVR, DolphinVR, QuestZDoom*).
4. **Game Mods & Tweaks:** Meaningful mods and standalone gameplay tweaks for native Quest games (e.g., *Beat Saber, Bonelab, Blade & Sorcery: Nomad*).

---

## 3. Information Architecture (Port Specs)

Each individual port entry features a standardized structure:

* **Media:** Cover banner (16:9) and lightweight gameplay/devlog embed via YouTube.
* **Developer & Credits:** Developer/team name (e.g. Team Beef, amwatson) with external website/Patreon link and dedicated filter tag.
* **Development Status:** `Released`, `In Development (WIP)`, or `Playable Beta`.
* **Hardware & Specs:** Explicit compatibility (`Quest 2`, `Quest 3`, `Quest 3S`), locomotion support, and 6DoF Touch motion tracking.
* **Folder Mappings:** Exact path in the internal headset storage (e.g., `/sdcard/RTCWQuest/main/`) with a one-click copy shortcut.
* **Direct Links:** Official base game store (Steam / GOG / Google Play) + APK / Engine repository (GitHub Releases, SideQuest, Discord).
* **Installation Guide:** Digestible step-by-step markdown tutorial (prerequisites, required files, destination folders, and quick troubleshooting tips).

---

## 4. Tech Stack & Infrastructure (Zero Cost)

* **Frontend:** Nuxt 3 (SSR/Nitro hybrid) + Tailwind CSS + `@heroicons/vue` + `marked`.
* **Database & Auth:** Supabase (Managed PostgreSQL, free tier with Row Level Security - RLS).
* **Deployment / Hosting:** Vercel (Free custom subdomain, automated Git CI/CD).
* **Media Storage:** Public URLs / YouTube embeds (optional Supabase Storage bucket for custom uploads).

---

## 5. Implementation Roadmap

* **Phase 1 (MVP — 2 to 3 days):**
  * Nuxt 3 project setup and `ports` schema migration in Supabase.
  * Home page with responsive card grid, live text search, category tabs, and status filters.
  * Detail view (`/ports/[slug]`) with video player, technical specs sheet, copy-to-clipboard storage shortcut, and markdown installation guide.
  * Initial seed of the top 8 to 10 consolidated ports.

* **Phase 2 (Engagement & Validation):**
  * Social authentication (Discord / Google) via Supabase Auth.
  * Community upvotes, favorites, and user comments/reports ("verified working on Quest 3S at 90Hz").

* **Phase 3 (Crowdsourcing):**
  * Public submission form for community ports/mods with an admin moderation queue (`status: pending_review`).
