// tailwind.config.js
module.exports = {
	darkMode: ["selector", "[data-theme=\"dark\"]"],
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./src/calendar/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.{js,ts,jsx,tsx}", // fallback to catch any missed dirs
	],
	theme: {
		extend: {},
	},
	plugins: [],
};