const path = require('path');

const vueSrc = './src';

module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
  transpileDependencies: [
    'quasar',
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, vueSrc),
      },
      extensions: ['.vue', '.js', '.json'],
    },
    devtool: 'source-map',
  },
};
