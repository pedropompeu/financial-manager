/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0984e3',
          hover: '#0773c5',
          light: '#e8f4fd',
        },
        brand: {
          DEFAULT: '#1a1a2e',
          light: '#2d2d44',
        },
        success: {
          DEFAULT: '#00b894',
          light: '#e8f8f5',
        },
        danger: {
          DEFAULT: '#d63031',
          light: '#fdecea',
        },
        surface: '#ffffff',
        border: '#e0e0e0',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        dropdown: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
