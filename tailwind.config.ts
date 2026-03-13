import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bias: {
          left: '#3b82f6',
          'lean-left': '#60a5fa',
          center: '#a855f7',
          'lean-right': '#f87171',
          right: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
export default config;
