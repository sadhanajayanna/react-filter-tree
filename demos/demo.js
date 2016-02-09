import React, { Component } from 'react'
import FilterTree, { decorateTree } from '../src/FilterTree'
import { diseaseTree } from '../test/mock-disease-tree.js'
import { render } from 'react-dom'

let mockTree = decorateTree(diseaseTree.tree) // decorating the tree is key

class App extends Component {
  constructor (...args) {
    super(...[args])

    this.state = {
      tree: mockTree,
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
    return <FilterTree treeNodes={_.clone(this.state.tree)}
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
