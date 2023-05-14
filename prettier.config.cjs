/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
};

module.exports = config;
