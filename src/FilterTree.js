import _ from 'lodash'
import React, { Component } from 'react'
import Tree, { getToggledTree, treesAreEqual } from './Tree'
import './styles.scss'

class FilterTree extends Component {
  static propTypes = {
    treeNodes: React.PropTypes.array.isRequired,
    onSelectionsChange: React.PropTypes.func.isRequired,
    onTypeaheadChange: React.PropTypes.func.isRequired,
    selectedTerms: React.PropTypes.array.isRequired,
    includeParentNodes: React.PropTypes.bool.isRequired,
    filterTerm: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    this.originalTree = this.props.treeNodes
  }

  componentWillReceiveProps (nextProps) {
    if (!treesAreEqual(this.props.treeNodes, nextProps.treeNodes)) {
      this.originalTree = _.clone(this.props.treeNodes)
    }
  }

  handleTypeaheadChange (event) {
    let filterTerm = event.currentTarget.value
    let toggled = getToggledTree(this.originalTree, filterTerm)
    this.props.onTypeaheadChange(toggled, filterTerm)
  }

  render () {
    let {
      treeNodes,
      onSelectionsChange,
      selectedTerms,
      includeParentNodes,
      filterTerm
    } = this.props

    let debounced = _.debounce(this.handleTypeaheadChange.bind(this), 250)

    let typeAheadHandler = function (event) {
      // React will clear out that event, so we need to clone it the first time so that it's available to our
      // debounced function, otherwise, the debounced method will receive null for an event object... which is bad
      debounced(_.clone(event))
    }

    return (
      <div className="filter-tree">
        <div className="input-search-container">
          <input type="search" onChange={typeAheadHandler.bind(this)} />
        </div>
        <Tree treeNodes={treeNodes}
              onSelectionsChange={onSelectionsChange}
              selectedTerms={selectedTerms}
              includeParentNodes={includeParentNodes}
              filterTerm={filterTerm} />
      </div>
    )
  }
}

export default FilterTree
