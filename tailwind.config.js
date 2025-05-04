/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				fadeUp: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				glow: {
					"0%": { textShadow: "0 0 5px rgba(255, 255, 255, 0)" },
					"50%": { textShadow: "0 0 20px rgba(255, 255, 255, 0.7)" },
					"100%": { textShadow: "0 0 5px rgba(255, 255, 255, 0)" },
				},
			},
			animation: {
				float: "float 3s ease-in-out infinite",
				fadeIn: "fadeIn 1s ease-out both",
				fadeUp: "fadeUp 0.8s ease-out both",
				glow: "glow 2s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
