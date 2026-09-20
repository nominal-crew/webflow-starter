export default {
  extends: ['stylelint-config-standard'],

  ignoreFiles: ['dist/**/*'],

  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'declaration-empty-line-before': null,
    'media-feature-range-notation': 'context'
  }
};
