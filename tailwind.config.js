/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  daisyui: {
    themes: [
      {
        mowfleet: {
          primary: '#559e00',
          secondary: '#d926a9',
          accent: '#1fb2a6',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          success: '#68c346',
        },
      },
      'light',
      // 'dark',
    ],
    logs: false,
  },
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}
