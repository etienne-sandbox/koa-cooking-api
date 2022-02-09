module.exports = {
  transform: {
    // On configure esbuild-runner pour les fichiers JS
    "\\.js$": "esbuild-runner/jest",
  },
};
