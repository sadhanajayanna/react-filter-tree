var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    "react-filter-tree": ['./src/FilterTree.js']
  },
  output: {
    path: path.join(__dirname, './dist/'),
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
