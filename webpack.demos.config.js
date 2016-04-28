var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    "demo": ['./demos/demo.js']
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  }
}
