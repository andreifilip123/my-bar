/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
};
