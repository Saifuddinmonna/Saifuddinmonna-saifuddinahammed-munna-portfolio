const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ["garden" ,"cupcake", "dark", "cmyk"],
	},
	plugins: [require("kutty"), require("flowbite/plugin"), require("daisyui")],
});
