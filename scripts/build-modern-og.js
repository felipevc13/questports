import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

function toBase64(filePath) {
  const file = fs.readFileSync(filePath)
  return `data:image/jpeg;base64,${file.toString('base64')}`
}

const lambda1vr = toBase64('/tmp/og-covers/lambda1vr.jpg')
const gtasa = toBase64('/tmp/og-covers/gtasa_vr.jpg')
const galaxy = toBase64('/tmp/og-covers/galaxyquest.jpg')
const halo = toBase64('/tmp/og-covers/halocequest.jpg')
const doom3 = toBase64('/tmp/og-covers/doom3quest.jpg')
const goldeneye = toBase64('/tmp/og-covers/goldeneye-vr.jpg')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QuestPorts Modern OG Image</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #080d1a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #ffffff;
      position: relative;
    }

    /* Ambient Lighting */
    .glow-cyan {
      position: absolute;
      top: -100px;
      left: 80px;
      width: 600px;
      height: 500px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0) 70%);
      filter: blur(70px);
      pointer-events: none;
    }
    .glow-blue {
      position: absolute;
      bottom: -120px;
      right: 100px;
      width: 700px;
      height: 600px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.20) 0%, rgba(59, 130, 246, 0) 70%);
      filter: blur(80px);
      pointer-events: none;
    }
    .glow-purple {
      position: absolute;
      top: 50%;
      right: 30%;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(147, 51, 234, 0.14) 0%, rgba(147, 51, 234, 0) 70%);
      filter: blur(90px);
      pointer-events: none;
    }

    /* Subtle Modern Grid Background */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      background-size: 36px 36px;
      mask-image: radial-gradient(ellipse 95% 85% at 50% 50%, black 40%, transparent 95%);
    }

    /* Layout Frame */
    .canvas {
      position: relative;
      z-index: 10;
      width: 1200px;
      height: 630px;
      display: flex;
      padding: 48px 56px;
      justify-content: space-between;
      align-items: center;
    }

    /* Left Info Column */
    .left-col {
      width: 540px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-logo-svg {
      width: 48px;
      height: 34px;
      filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.7));
    }

    .brand-title {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
    }

    .brand-title span {
      color: #38bdf8;
    }

    .hero-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
    }

    .badge-quest {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.04em;
    }

    .badge-zeropc {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 11px;
      border-radius: 6px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.04em;
      font-family: 'JetBrains Mono', monospace;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .hero-headline {
      font-size: 44px;
      font-weight: 900;
      line-height: 1.12;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-top: 14px;
      margin-bottom: 12px;
    }

    .hero-headline .gradient-accent {
      background: linear-gradient(135deg, #38bdf8 0%, #06b6d4 50%, #818cf8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subhead {
      font-size: 15.5px;
      line-height: 1.55;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 22px;
    }

    /* Stats Counter Bar (identical to index.vue) */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      margin-bottom: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
    }

    .stat-val.emerald {
      color: #34d399;
    }

    .stat-val.cyan {
      color: #38bdf8;
    }

    .stat-lbl {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.02em;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Feature pills */
    .features-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .feat-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 5px 10px;
      border-radius: 8px;
    }

    .footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .site-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .site-tags {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    /* Right Showcase Column (Modern Steam-Capsule Cards) */
    .right-col {
      width: 520px;
      height: 534px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 248px);
      gap: 14px;
      transform: perspective(1200px) rotateY(-6deg) rotateX(2deg);
      filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.85));
    }

    /* Port Card Component (exact clone of PortCard.vue) */
    .port-card {
      background: #0f172a;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.6);
    }

    .capsule-wrapper {
      position: relative;
      width: 100%;
      height: 116px;
      background: #020617;
      overflow: hidden;
    }

    .capsule-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .capsule-grad-bottom {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%, rgba(0,0,0,0.3) 100%);
      pointer-events: none;
    }

    .capsule-grad-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 38px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%);
      pointer-events: none;
    }

    /* Top Badges */
    .card-top-badges {
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;
    }

    .cat-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 5px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.88);
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.22);
    }

    .status-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .status-badge.released {
      background: rgba(6, 78, 59, 0.92);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.45);
    }

    .status-badge.beta {
      background: rgba(120, 53, 15, 0.92);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.45);
    }

    .status-dot {
      width: 4.5px;
      height: 4.5px;
      border-radius: 50%;
    }
    .status-badge.released .status-dot { background: #34d399; }
    .status-badge.beta .status-dot { background: #fbbf24; }

    /* Preview pill on bottom right */
    .preview-pill {
      position: absolute;
      bottom: 6px;
      right: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(0, 0, 0, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 2px 5px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: #94a3b8;
      z-index: 5;
    }

    .preview-pill svg {
      width: 8px;
      height: 8px;
      fill: #38bdf8;
    }

    /* Card Info Area */
    .card-info {
      padding: 8px 10px;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .card-title-row {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .card-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-dev-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 9.5px;
      color: #64748b;
    }

    .card-dev {
      color: #94a3b8;
      font-weight: 600;
    }

    .card-ver {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      color: #64748b;
    }

    .card-footer-chips {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 5px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .hw-chips {
      display: flex;
      gap: 3px;
    }

    .hw-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1px 4px;
      border-radius: 3px;
    }

    .card-view-btn {
      font-size: 9.5px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  </style>
</head>
<body>
  <div class="glow-cyan"></div>
  <div class="glow-blue"></div>
  <div class="glow-purple"></div>
  <div class="grid-overlay"></div>

  <div class="canvas">
    <!-- Left Info Column -->
    <div class="left-col">
      <div>
        <div class="brand-row">
          <!-- Official QuestPorts Logo SVG -->
          <svg class="brand-logo-svg" viewBox="0 0 388 268" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="qp-top" x1="40" y1="70" x2="305" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#00d4ff" />
                <stop offset="25%" stop-color="#05a6ff" />
                <stop offset="65%" stop-color="#016dff" />
                <stop offset="100%" stop-color="#293aff" />
              </linearGradient>
              <linearGradient id="qp-bot" x1="75" y1="190" x2="350" y2="190" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#1d3aff" />
                <stop offset="30%" stop-color="#3862ff" />
                <stop offset="65%" stop-color="#637eff" />
                <stop offset="90%" stop-color="#9d96ff" />
                <stop offset="100%" stop-color="#aca7ff" />
              </linearGradient>
              <linearGradient id="qp-fold" x1="300" y1="65" x2="350" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M 85 158 L 255 158 C 285 158, 305 140, 305 108 L 305 65 C 305 65, 340 115, 350 155 C 353 175, 348 205, 320 228 C 295 244, 260 244, 215 244 L 130 244 C 90 244, 75 220, 80 185 L 85 158 Z" fill="url(#qp-bot)" />
            <path d="M 80 185 C 55 160, 33 130, 33 90 C 33 50, 60 25, 110 25 L 245 25 C 280 25, 305 40, 305 65 L 305 108 L 135 108 C 105 108, 85 125, 85 158 L 80 185 Z" fill="url(#qp-top)" />
            <path d="M 305 65 L 305 108 L 348 160 C 342 125, 325 85, 305 65 Z" fill="url(#qp-fold)" />
            <path d="M 305 65 L 305 108" stroke="white" stroke-opacity="0.3" stroke-width="1.5" />
          </svg>

          <span class="brand-title">Quest<span>Ports</span></span>
        </div>

        <div class="hero-meta">
          <div class="badge-quest">Meta Quest 2 • 3 • 3S • Pro</div>
          <div class="badge-zeropc">
            <span class="pulse-dot"></span>
            Zero PC Required
          </div>
        </div>

        <h1 class="hero-headline">
          Standalone VR Ports <br><span class="gradient-accent">& Emulators</span>
        </h1>

        <p class="hero-subhead">
          Open-source directory of classic PC & console games running natively in 6DoF on Meta Quest. Verified storage paths, APK links, and guides.
        </p>

        <!-- Stats Bar matching index.vue -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-val">36</span>
            <span class="stat-lbl">Indexed Ports</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-val emerald">100%</span>
            <span class="stat-lbl">Free & Open</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-val cyan">6DoF</span>
            <span class="stat-lbl">Motion VR</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-val">0 PC</span>
            <span class="stat-lbl">Streaming</span>
          </div>
        </div>

        <!-- High Signal Features -->
        <div class="features-row">
          <div class="feat-chip">📁 Verified Storage Paths</div>
          <div class="feat-chip">📦 GitHub Release APKs</div>
          <div class="feat-chip">🎮 6DoF Motion Controls</div>
        </div>
      </div>

      <div class="footer-row">
        <div class="site-url">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/>
            <path d="M2 12h20"/>
          </svg>
          questports.vercel.app
        </div>
        <div class="site-tags">
          SOURCE PORTS • EMULATORS • MODS
        </div>
      </div>
    </div>

    <!-- Right Showcase Column (Real Steam-Capsule Cards) -->
    <div class="right-col">
      <div class="cards-grid">
        <!-- Card 1: Half-Life 1 (Lambda1VR) -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${lambda1vr}" alt="Half-Life 1 VR" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Source Port</span>
              <span class="status-badge released"><span class="status-dot"></span>Released</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">Half-Life 1 (Lambda1VR)</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">Team Beef</strong></span>
                <span class="card-ver">v1.4.1</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">2</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>

        <!-- Card 2: GTA San Andreas VR -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${gtasa}" alt="GTA San Andreas VR" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Game Mod</span>
              <span class="status-badge beta"><span class="status-dot"></span>In Dev</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">GTA: San Andreas VR</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">dubrovskiy-yevhen</strong></span>
                <span class="card-ver">v0.1</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">Pro</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Super Mario Galaxy (GalaxyQuest) -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${galaxy}" alt="Super Mario Galaxy VR" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Emulator</span>
              <span class="status-badge beta"><span class="status-dot"></span>Beta</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">Super Mario Galaxy VR</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">Team Beef</strong></span>
                <span class="card-ver">v0.9</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">2</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>

        <!-- Card 4: Halo CE VR -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${halo}" alt="Halo CE VR" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Source Port</span>
              <span class="status-badge beta"><span class="status-dot"></span>Beta</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">Halo CE VR (HaloceQuest)</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">Team Beef</strong></span>
                <span class="card-ver">v0.4.2</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">Pro</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>

        <!-- Card 5: Doom 3: Quest Edition -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${doom3}" alt="Doom 3 Quest" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Source Port</span>
              <span class="status-badge released"><span class="status-dot"></span>Released</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">Doom 3: Quest Edition</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">Team Beef</strong></span>
                <span class="card-ver">v1.1</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">2</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>

        <!-- Card 6: GoldenEye 007 VR -->
        <div class="port-card">
          <div class="capsule-wrapper">
            <img class="capsule-img" src="${goldeneye}" alt="GoldenEye 007 VR" />
            <div class="capsule-grad-bottom"></div>
            <div class="capsule-grad-top"></div>
            <div class="card-top-badges">
              <span class="cat-badge">Source Port</span>
              <span class="status-badge beta"><span class="status-dot"></span>Beta</span>
            </div>
            <div class="preview-pill">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Preview</span>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-title">GoldenEye 007 VR</span>
              <div class="card-dev-row">
                <span>by <strong class="card-dev">MrSco</strong></span>
                <span class="card-ver">v0.1.11</span>
              </div>
            </div>
            <div class="card-footer-chips">
              <div class="hw-chips">
                <span class="hw-chip">Quest 3</span>
                <span class="hw-chip">3S</span>
                <span class="hw-chip">Pro</span>
              </div>
              <span class="card-view-btn">View →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`

fs.writeFileSync(path.join(process.cwd(), 'scripts/generate-og-image.html'), html)
console.log('Successfully generated scripts/generate-og-image.html')

// Render to public/og-image.png using headless chrome
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const htmlPath = path.join(process.cwd(), 'scripts/generate-og-image.html')
const outPath = path.join(process.cwd(), 'public/og-image.png')

const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1200,630 --hide-scrollbars "file://${htmlPath}"`
execSync(cmd, { stdio: 'inherit' })
console.log('Successfully rendered to public/og-image.png')
