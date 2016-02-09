var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    "react-filter-tree": ['./lib/FilterTree.js']
  },
  output: {
    path: path.join(__dirname, './lib/'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    library: 'FilterTree',
    libraryTarget: 'umd',
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
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'lodash': 'lodash',
    '_': 'lodash'
  },
}
