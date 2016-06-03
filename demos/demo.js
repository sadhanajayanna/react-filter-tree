import React, { Component } from 'react'
import FilterTree, { decorateTree } from '../src/FilterTree'
import mockTree from '../test/mock-tree.js'
import { render } from 'react-dom'

let tree = decorateTree(mockTree) // decorating the tree is key

class App extends Component {
  componentWillMount () {
    this.state = {
      tree,
      terms: [],
      includeParentNodes: false,
      filterTerm: ''
    }
  }

  onSelectionsChange (terms) {
    this.setState({ terms })
  }

  onTypeaheadChange (tree, filterTerm) {
    this.setState({ tree, filterTerm })
  }

  render () {
    return <FilterTree treeNodes={_.cloneDeep(this.state.tree)}
              onSelectionsChange={this.onSelectionsChange.bind(this)}
              onTypeaheadChange={this.onTypeaheadChange.bind(this)}
              includeParentNodes={this.state.includeParentNodes}
              selectedTerms={this.state.terms}
              filterTerm={this.state.filterTerm} />
  }
}

render((
  (<App />)
), document.getElementById('container'))
