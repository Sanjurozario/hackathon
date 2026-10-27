/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0B0D11',
          dark: '#07080B',
          light: '#11141B',
        },
        surface: {
          DEFAULT: '#141821',
          light: '#1D222E',
          card: '#161B25',
          border: 'rgba(146, 152, 162, 0.16)',
          hover: '#222837',
        },
        ivory: {
          DEFAULT: '#F3F0E8',
          muted: '#DDD9CE',
          subtle: '#B8B5AB',
        },
        muted: {
          DEFAULT: '#9298A2',
          dark: '#6E747E',
          light: '#B4B9C3',
        },
        cyan: {
          DEFAULT: '#46C7DE',
          light: '#67D7EC',
          glow: 'rgba(70, 199, 222, 0.2)',
          dark: '#269EBA',
        },
        magenta: {
          DEFAULT: '#E5385D',
          hover: '#F43F68',
          glow: 'rgba(229, 56, 93, 0.25)',
          dark: '#C02649',
        },
        red: {
          DEFAULT: '#E5385D', // matches gaming accent & blueprint CTA
          glow: 'rgba(229, 56, 93, 0.2)',
          dark: '#C02649',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        gta: ["'Pricedown Bl'", "'Pricedown'", "'Bebas Neue'", 'Impact', 'sans-serif'],
        bebas: ["'Bebas Neue'", "'Teko'", 'sans-serif'],
        script: ['"Permanent Marker"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.65)',
        'magenta-pill': '0 4px 20px rgba(229, 56, 93, 0.35)',
      },
    },
  },
  plugins: [],
}
