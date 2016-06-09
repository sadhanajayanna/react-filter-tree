require('shelljs/global')
var _ = require('lodash')

// prep the build directory
rm('-rf', 'dist/')
mkdir('dist')

// styles
exec('sass src/styles.scss dist/react-filter-tree.css') // build sass
cat('node_modules/react-treeview/react-treeview.css').toEnd('dist/react-filter-tree.css') // append react-treeview styles

if (_.includes(process.argv, '--demos')) {
  exec('webpack --config webpack.demos.config.js')
} else {
  exec('webpack --config webpack.config.js')
}
