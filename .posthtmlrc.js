module.exports = {
	plugins: {
		'posthtml-include': { root: "src/frontend" },
		'posthtml-favicons': { path: "src/frontend", outDir: "dist/frontend/icons" }
	}
};