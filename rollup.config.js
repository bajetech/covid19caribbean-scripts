const commonjs = require("@rollup/plugin-commonjs");

module.exports = [
  {
    input: "src/lambdas/syncCovid19Stats.js",
    output: {
      exports: "named",
      file: "dist/syncCovid19Stats.js",
      format: "cjs",
    },
    plugins: [commonjs()],
  },
];
