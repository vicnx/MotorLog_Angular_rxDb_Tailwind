/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                primary: {
                    50: '#e0f7f6',
                    100: '#b3eae5',
                    200: '#80dfd5',
                    300: '#47d2c3',
                    400: '#27cabe',
                    500: '#14b8a6',
                    600: '#0da38f',
                    700: '#0b8f7c',
                    800: '#077766',
                    900: '#055e53',
                    950: '#023835'
                    // 50: '#f0fdfa',
                    // 100: '#ccfbf1',
                    // 200: '#a7f3d0',
                    // 300: '#6ee7b7',
                    // 400: '#34d399',
                    // 500: '#10b981',
                    // 600: '#059669',
                    // 700: '#047857',
                    // 800: '#065f46',
                    // 900: '#064e3b',
                    // 950: '#022c22'
                }
            },
            fontFamily: {
              'sans': ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji']
            }
        }
    },
    plugins: [require('@tailwindcss/forms')]
};
