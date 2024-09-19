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
				}
			},
			fontFamily: {
				sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji']
			},
      transitionProperty: {
        'height': 'height'
      }
		}
	},
	safelist: [
		'text-yellow-500',
		'text-yellow-600',
		'text-red-500',
		'text-red-600',
		'text-green-600',
		'text-blue-500',
		'text-orange-500',
		'text-teal-500',
		'text-black',
		'text-gray-700',
		'text-indigo-600',
		'text-blue-400',
		'text-cyan-400',
		'text-red-400',
		'text-yellow-300',
		'text-gray-500'
	],
	plugins: [require('@tailwindcss/forms')]
};
