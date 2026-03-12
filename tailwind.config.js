/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tomate': '#B43A2F',
        'creme-claro': '#FCFAF5',
        'creme-manteiga': '#F7EBDD',
        'cafe': '#4A2E24',
        'dourado': '#D9913B',
        'verde-tempero': '#6E7F52',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        manual: ['Caveat', 'cursive'],
      },
      keyframes: {
        'carimbo': {
          '0%': { transform: 'scale(1.1) rotate(-5deg)', opacity: '0' },
          '50%': { transform: 'scale(0.95) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'micro-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(110vh) scale(0.8) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.3' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-20vh) scale(1.2) rotate(45deg)', opacity: '0' },
        },
        'steam-pulse': {
          '0%': { transform: 'scale(1) translateY(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.05) translateY(-20px) rotate(2deg)', opacity: '0.4' },
          '100%': { transform: 'scale(1.1) translateY(-40px) rotate(-2deg)', opacity: '0' },
        },
        'pan-bg': {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '80px 80px' },
        },
        'moto-ride': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-4px) rotate(-1deg)' },
          '75%': { transform: 'translateY(2px) rotate(0.5deg)' },
        },
        'roda-girar': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'fumaca-subir': {
          '0%': { opacity: '0.7', transform: 'translate(0, 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-8px, -20px) scale(1.8)' },
        },
        'caixa-bamboleia': {
          '0%, 100%': { transform: 'rotate(5deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        'lencinho-vento': {
          '0%, 100%': { transform: 'rotate(-5deg) skewX(0deg)' },
          '50%': { transform: 'rotate(-15deg) skewX(5deg)' },
        },
        'piscar-farol': {
          '0%, 90%, 100%': { opacity: '1' },
          '95%': { opacity: '0.3' },
        },
        'estrela-pulsar': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.4)', opacity: '1' },
        },
        'ponto-flutuar': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.4' },
          '50%': { transform: 'translateY(-12px)', opacity: '0.8' },
        },
        'msg-fade': {
          'from': { opacity: '0', transform: 'translateY(4px)' },
          'to': { opacity: '0.5', transform: 'translateY(0)' },
        }
      },
      animation: {
        'carimbo': 'carimbo 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'micro-pulse': 'micro-pulse 2s infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-up': 'float-up 12s linear infinite',
        'steam-pulse': 'steam-pulse 6s ease-in-out infinite',
        'pan-bg': 'pan-bg 4s linear infinite',
        'moto-ride': 'moto-ride 0.5s ease-in-out infinite',
        'roda-girar': 'roda-girar 0.4s linear infinite',
        'fumaca-subir': 'fumaca-subir 0.6s ease-out infinite',
        'caixa-bamboleia': 'caixa-bamboleia 0.6s ease-in-out infinite',
        'lencinho-vento': 'lencinho-vento 0.4s ease-in-out infinite',
        'piscar-farol': 'piscar-farol 2s infinite',
        'estrela-pulsar': 'estrela-pulsar 1.5s ease-in-out infinite',
        'ponto-flutuar': 'ponto-flutuar 2s ease-in-out infinite',
        'msg-fade': 'msg-fade 0.3s ease-out forwards',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}