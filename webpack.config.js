var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    "react-filter-tree": ['./src/FilterTree.js'],
    "demo": './src/demo.js'
  },
  output: {
    path: path.join(__dirname, './lib/'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loaders: ['style', 'css', 'postcss-loader'],
      include: [
        path.resolve(__dirname, 'src/')
      ]
    },
    {
      test: /\.scss$/,
      loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
      include: [
        path.resolve(__dirname, 'src/')
      ]
    }]
  }
}
