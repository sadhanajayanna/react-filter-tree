var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    "demo": ['./demos/demo.js']
  },
  output: {
    path: path.join(__dirname, './lib/'),
    filename: '[name].js',
    sourceMapFilename: '[name].map'
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
