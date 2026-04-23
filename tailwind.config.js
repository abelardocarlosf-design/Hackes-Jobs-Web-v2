/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          black: '#0A0A0A',
          blue: '#1E40AF',
          orange: '#F97316',
          white: '#FFFFFF',
          slate: '#F8FAFC',
        }
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.08)',
        'blue': '0 20px 40px -15px rgba(30, 64, 175, 0.2)',
        'orange': '0 20px 40px -15px rgba(249, 115, 22, 0.2)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
