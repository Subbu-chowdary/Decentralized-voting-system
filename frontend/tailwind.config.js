// module.exports = {
//    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//    darkMode: false, // or 'media' or 'class'
//    theme: {
//       extend: {
//          boxShadow: {
//             card: '14px 14px 28px rgba(144,166,186,1),-14px -14px 28px rgba(230,255,255,0.5)',
//          },
//          backgroundColor: {
//             winner: '#bbd8f2',
//          },
//       },
//    },
//    variants: {
//       extend: {},
//    },
//    plugins: [],
// };


module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // Replaced 'purge' with 'content'
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        card: '14px 14px 28px rgba(144,166,186,1),-14px -14px 28px rgba(230,255,255,0.5)',
      },
      backgroundColor: {
        winner: '#bbd8f2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Added forms plugin
  ],
};
