// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
// //   theme: {
// //     extend: {
// //       colors: {
// //         primary: {
// //           50: "#fef7ff",
// //           100: "#fae8ff",
// //           200: "#f5d0fe",
// //           300: "#f0abfc",
// //           400: "#e879f9",
// //           500: "#d946ef",
// //           600: "#be62cc",
// //           700: "#a855f7",
// //           800: "#9333ea",
// //           900: "#7c2bad",
// //           950: "#581c87",
// //         },
// //         secondary: {
// //           50: "#f8fafc",
// //           100: "#f1f5f9",
// //           200: "#e2e8f0",
// //           300: "#cbd5e1",
// //           400: "#94a3b8",
// //           500: "#64748b",
// //           600: "#475569",
// //           700: "#334155",
// //           800: "#1e293b",
// //           900: "#0f172a",
// //         },
// //         accent: {
// //           500: "#10b981",
// //           600: "#059669",
// //         }
// //       },
// //       fontFamily: {
// //         sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
// //       },
// //     },
// //   },
// //   plugins: [],
// // };

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

//   theme: {
//     extend: {
//       animation: {
//         'typewriter': 'typewriter 3s steps(30) infinite',
//         'blink': 'blink 1s infinite',
//         'float': 'float 6s ease-in-out infinite',
//         'shine': 'shine 2s infinite',
//         'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
//         'orbit': 'orbit 12s linear infinite',
//         'counter-up': 'counter-up 2.5s ease-out forwards',
//         'parallax': 'parallax 0.5s ease-out',
//         'bounce-slow': 'bounce 2s infinite',
//       },
//         'typewriter': 'typewriter 3s steps(30) infinite',
//         'blink': 'blink 1s infinite',
//         'float': 'float 6s ease-in-out infinite',
//         'shine': 'shine 2s infinite',
//         'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
//         'orbit': 'orbit 12s linear infinite',
//         'counter-up': 'counter-up 2.5s ease-out forwards',
//         'parallax': 'parallax 0.5s ease-out',
//         'bounce-slow': 'bounce 2s infinite',
//       },
//       colors: {
//         brand: {
//           green: "#1f7a2e",
//           dark: "#000000",
//           light: "#ffffff",
//         },
//         primary: {
//           50: "#edf7ee",
//           100: "#d7edd9",
//           200: "#b3dbb8",
//           300: "#7fc08a",
//           400: "#4ea45f",
//           500: "#1f7a2e",
//           600: "#176125",
//           700: "#124d1d",
//           800: "#0d3915",
//           900: "#08250d",
//           950: "#041506",
//         },
//         secondary: {
//           50: "#f5f5f5",
//           100: "#e5e5e5",
//           200: "#d4d4d4",
//           300: "#a3a3a3",
//           400: "#737373",
//           500: "#525252",
//           600: "#404040",
//           700: "#262626",
//           800: "#171717",
//           900: "#0a0a0a",
//           950: "#000000",
//         },
//       },
//       fontFamily: {
//         sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      animation: {
        typewriter: "typewriter 3s steps(30) infinite",
        blink: "blink 1s infinite",
        float: "float 6s ease-in-out infinite",
        shine: "shine 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        orbit: "orbit 12s linear infinite",
        "counter-up": "counter-up 2.5s ease-out forwards",
        parallax: "parallax 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },

      colors: {
        brand: {
          green: "#1f7a2e",
          dark: "#000000",
          light: "#ffffff",
        },

        primary: {
          50: "#edf7ee",
          100: "#d7edd9",
          200: "#b3dbb8",
          300: "#7fc08a",
          400: "#4ea45f",
          500: "#1f7a2e",
          600: "#176125",
          700: "#124d1d",
          800: "#0d3915",
          900: "#08250d",
          950: "#041506",
        },

        secondary: {
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#262626",
          800: "#171717",
          900: "#0a0a0a",
          950: "#000000",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },

  plugins: [],
};