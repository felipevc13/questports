/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './app.vue'
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'rgb(30, 41, 59)',
      },
      colors: {
        // Strict semantic design system tokens
        border: 'rgb(30, 41, 59)',           // slate-800
        input: 'rgb(30, 41, 59)',            // slate-800
        ring: 'rgb(14, 165, 233)',           // sky-500
        background: 'rgb(8, 11, 20)',        // dark slate background
        foreground: 'rgb(248, 250, 252)',    // slate-50
        primary: {
          DEFAULT: 'rgb(14, 165, 233)',      // sky-500
          foreground: 'rgb(8, 11, 20)'       // dark contrast
        },
        secondary: {
          DEFAULT: 'rgb(30, 41, 59)',        // slate-800
          foreground: 'rgb(248, 250, 252)'   // slate-50
        },
        destructive: {
          DEFAULT: 'rgb(225, 29, 72)',       // rose-600
          foreground: 'rgb(248, 250, 252)'
        },
        muted: {
          DEFAULT: 'rgb(19, 26, 42)',        // dark input/muted surface
          foreground: 'rgb(148, 163, 184)'   // slate-400
        },
        accent: {
          DEFAULT: 'rgb(30, 41, 59)',
          foreground: 'rgb(248, 250, 252)'
        },
        popover: {
          DEFAULT: 'rgb(15, 23, 42)',        // slate-900
          foreground: 'rgb(248, 250, 252)'
        },
        card: {
          DEFAULT: 'rgb(15, 21, 35)',        // card surface
          foreground: 'rgb(248, 250, 252)'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)'
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      }
    }
  },
  plugins: []
}
