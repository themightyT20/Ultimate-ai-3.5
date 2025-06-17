module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        geometric: ['Montserrat', 'Inter', 'sans-serif'],
      },
      colors: {
        'glass-bg': 'rgba(255,255,255,0.15)',
        'glass-dark': 'rgba(0,0,0,0.45)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(120deg, #293b7c 0%, #4d2ea0 50%, #b34be2 100%)',
      }
    }
  },
  plugins: []
};
