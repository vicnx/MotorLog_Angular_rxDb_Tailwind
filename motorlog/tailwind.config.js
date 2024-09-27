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
          50: '#f1ebff',
          100: '#d0c6ff',
          200: '#a39eff',
          300: '#7b76ff',
          400: '#5b5cff',
          500: '#8B5CF6', // Color base
          600: '#743cdb',
          700: '#5c2db3',
          800: '#461f8c',
          900: '#3a1781',
          950: '#210d54'
        }

			},
			fontFamily: {
				sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji']
			},
			transitionProperty: {
				height: 'height'
			}
		}
	},
	safelist: [
    'text-yellow-500',
    'text-yellow-600',
    'text-red-500',
    'text-red-600',
    'text-green-600',
    'text-green-500',
    'text-blue-500',
    'text-blue-400',
    'text-orange-500',
    'text-teal-500',
    'text-black',
    'text-gray-700',
    'text-indigo-600',
    'text-cyan-400',
    'text-red-400',
    'text-yellow-300',
    'text-gray-500',
    'text-pink-500',
    'text-fuchsia-600'
	],
	plugins: [require('@tailwindcss/forms')]
};
