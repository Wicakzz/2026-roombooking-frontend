/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ganti kode hex di bawah ini untuk mengubah seluruh aplikasi
        primary: {
          light: '#ecfdf5', // emerald-50
          DEFAULT: '#059669', // emerald-600
          dark: '#047857',   // emerald-700
        }
      }
    },
  },
  plugins: [],
}