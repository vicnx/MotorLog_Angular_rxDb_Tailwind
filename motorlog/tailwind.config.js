/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	darkMode: 'class',
	future: {
		hoverOnlyWhenSupported: true
	},
	theme: {
		extend: {
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				primary: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#34d399',
					500: '#48d0b0', // Verde Bulbasaur Base
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					950: '#022c22'
				}
			},
			fontFamily: {
				sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
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
