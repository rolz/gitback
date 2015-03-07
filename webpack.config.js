var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: {
    lib: './source/lib/index.jsx',
    admin: './source/admin/index.jsx',
    user: './source/user/index.jsx',
    home: './source/home/index.jsx'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!autoprefixer!sass!' },
      { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      Logger: 'js-logger',
      Cookies: 'cookies-js',
      React: 'react',
      Router: 'react-router',
      Reflux: 'reflux'
    })
  ]
};