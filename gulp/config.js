module.exports = {
  root: {
    src: './src',
    jsSrc: './src/src_scripts',
    jsDest: './src/scripts'
  },
  tasks: {
    scripts: {
      // src: 'scripts',
      // dest: 'scripts',
      extractSharedJs: true,
      extensions: ['js'],
      bundles: [{
        entries: 'app.password.js',
        outputName: 'app.password.js'
      }]
      // bundles: [{
      //   entries: 'app.js',
      //   outputName: 'app.js'
      // },
      // {
      //   entries: 'app.password.js',
      //   outputName: 'app.password.js'
      // }]
    }
  }
};
