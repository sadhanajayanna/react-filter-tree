import React, { Component } from 'react'
import FilterTree from './FilterTree'
import { diseaseTree } from '../test/mock-disease-tree.js'

class App extends Component {
  constructor (...args) {
    super(...[args])

    this.state = {
      tree: diseaseTree.tree,
      terms: [],
      includeParentNodes: false,
      filterTerm: ''
    }
  }

  onSelectionsChange (terms) {
    console.log('terms', terms)
    this.setState({ terms: _.union(terms, this.state.terms) })
  }

  onTypeaheadChange (tree, filterTerm) {
    console.log('onTypeaheadChange', filterTerm)
    this.setState({ tree })
  }

  render () {
    console.log('render')
    return <FilterTree treeNodes={this.state.tree}
              onSelectionsChange={this.onSelectionsChange.bind(this)}
              onTypeaheadChange={this.onTypeaheadChange.bind(this)}
              includeParentNodes={this.state.includeParentNodes}
              selectedTerms={this.state.terms}
              filterTerm={this.state.filterTerm} />
  }
}

export default App
