export default {
  name: 'webflow-starter',

  assets: {
    js: 'bundle.js',
    css: 'bundle.css'
  },

  environments: {
    staging: {
      path: 'staging'
    },

    production: {
      path: 'production'
    }
  }
};
