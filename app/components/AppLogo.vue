<template>
  <svg
    viewBox="0 0 388 268"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="transition-transform duration-300"
  >
    <defs>
      <!-- Top Ribbon: Vibrant Cyan to Electric Royal Blue -->
      <linearGradient :id="`qp-top-${id}`" x1="40" y1="70" x2="305" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#00d4ff" />
        <stop offset="25%" stop-color="#05a6ff" />
        <stop offset="65%" stop-color="#016dff" />
        <stop offset="100%" stop-color="#293aff" />
      </linearGradient>

      <!-- Bottom Ribbon: Deep Violet / Indigo to Soft Lavender -->
      <linearGradient :id="`qp-bot-${id}`" x1="75" y1="190" x2="350" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1d3aff" />
        <stop offset="30%" stop-color="#3862ff" />
        <stop offset="65%" stop-color="#637eff" />
        <stop offset="90%" stop-color="#9d96ff" />
        <stop offset="100%" stop-color="#aca7ff" />
      </linearGradient>

      <!-- Right Fold Facet Subtle Highlight -->
      <linearGradient :id="`qp-fold-${id}`" x1="300" y1="65" x2="350" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="20%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.15" />
      </linearGradient>
    </defs>

    <!-- 1. Bottom Ribbon (Sweeps bottom from right fold to left tuck) -->
    <path
      d="M 85 158
         L 255 158
         C 285 158, 305 140, 305 108
         L 305 65
         C 305 65, 340 115, 350 155
         C 353 175, 348 205, 320 228
         C 295 244, 260 244, 215 244
         L 130 244
         C 90 244, 75 220, 80 185
         L 85 158 Z"
      :fill="`url(#qp-bot-${id})`"
    />

    <!-- 2. Top Ribbon (Sweeps top from left tuck around and over) -->
    <path
      d="M 80 185
         C 55 160, 33 130, 33 90
         C 33 50, 60 25, 110 25
         L 245 25
         C 280 25, 305 40, 305 65
         L 305 108
         L 135 108
         C 105 108, 85 125, 85 158
         L 80 185 Z"
      :fill="`url(#qp-top-${id})`"
    />

    <!-- 3. Fold Facet Depth Shading -->
    <path
      d="M 305 65 L 305 108 L 348 160 C 342 125, 325 85, 305 65 Z"
      :fill="`url(#qp-fold-${id})`"
    />

    <!-- 4. Subtle 3D Edge Highlight -->
    <path
      d="M 305 65 L 305 108"
      stroke="white"
      stroke-opacity="0.25"
      stroke-width="1.5"
    />
  </svg>
</template>

<script setup lang="ts">
const id = useId()
</script>
