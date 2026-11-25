export default {
  // build output is generated and minified
  ignoreFiles: ['dist/**', '.output/**', '.nuxt/**'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    // 'stylelint-config-recommended-scss', // Add SCSS-specific rules
  ],
  overrides: [
    {
      files: ['**/*.vue'], // Target Vue files
      customSyntax: 'postcss-html', // Enable parsing of HTML inside Vue files
    },
  ],
  rules: {
    'at-rule-no-unknown': null,
    "at-rule-prelude-no-invalid": null,
    // Tailwind v4 requires the plain `@import "tailwindcss"` form
    "import-notation": null,
  },
}
