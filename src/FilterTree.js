import _ from 'lodash'
import React, { Component } from 'react'
import TreeView from 'react-treeview'

function flattenTree (parentNode) {
  let list = (_.has(parentNode, 'children') && parentNode.children.length > 0) ? parentNode.children : [parentNode]

  let nodes = _.map(list, (node) => {
    if (!node) return

    if (_.has(node, 'children') && node.children.length > 0) {
      return [node, ...flattenTree(node)]
    }

    return node
  })

  return _.flattenDeep(nodes)
}

function uniq (nodes) {
  return _.uniq(nodes, node => node.ref)
}

export function getParents (node, list = [], firstPass = true) {
  if (!firstPass) list.push(node)

  if (node.parentNode) {
    getParents(node.parentNode, list, false)
  }

  return _.flattenDeep(list)
}

export function treesAreEqual (treeA, treeB) {
  if (!_.isArray(treeA) || !_.isArray(treeB)) throw new Error('both supplied trees must be arrays')

  if (treeA.length !== treeB.length) return false

  return _.every(treeA, (item, index) => {
    let itemA = treeA[index]
    let itemB = treeB[index]

    if (!_.isEmpty(item.children)) {
      return treesAreEqual(itemA.children, itemB.children)
    } else {
      return itemA.id === itemB.id
    }
  })
}

export function getVisibleMatches (tree, text) {
  if (_.isEmpty(text)) return []

  function contains (name, terms) {
    let filtered = _.filter(terms, (term) => {
      return _.includes(name, _.lowerCase(term))
    })

    return !_.isEmpty(filtered)
  }

  let flat = getFlattenedTree(tree)
  let matches = _.filter(flat, (node) => {
    let name = _.lowerCase(node.name)

    if (_.isString(text)) {
      return name.indexOf(_.lowerCase(text)) > -1
    } else if (_.isArray(text)) {
      return contains(name, text)
    }
  })

  let parents = getParentsForList(matches)
  let visible = _.union(matches, parents)
  return uniq(visible)
}

export function getParentsForList (list) {
  let mapped = _.map(list, node => {
    return getParents(node)
  })

  let flat = _.flattenDeep(mapped)
  return flat
}

export function getToggledTree (originalTree = [], filterTerm = undefined, matches = undefined) {
  if (!matches) {
    matches = getVisibleMatches(originalTree, filterTerm)
  }

  let tree = _.map(originalTree, (item) => {
    let node = _.assign({}, item)

    if (!_.isEmpty(filterTerm)) {
      let nodeMatches = _.filter(matches, match => match.name === node.name)
      node.visible = !_.isEmpty(nodeMatches)
    } else { // not looking for matches, show whole tree
      node.visible = true
    }

    if (node && !_.isEmpty(node.children)) {
      node.children = getToggledTree(node.children, filterTerm, matches)
    }

    return node
  })

  return tree
}

export function getFlattenedTree (tree) {
  if (!_.isArray(tree)) throw new Error('getFlattenedTree expects the tree to be an array')

  let parentNode = _.first(tree) // TODO this only makes sense because we have one root node (if plain object use it, else array grab first, else throw error)
  let list = []

  if (_.has(parentNode, 'children')) {
    let flat = flattenTree(parentNode)
    list = [parentNode, ...flat]
  } else {
    list = tree
  }

  return list
}

export function decorateTree (rawTree, payload) { // so festive
  let mapped = _.map(rawTree, (node) => {
    node = (_.isString(node)) ? { name: node } : node

    node = _.assign({}, node, payload, {
      visible: true,
      ref: _.random(0, Date.now())
    })

    if (!_.isEmpty(node.children)) {
      let updatedPayload = _.assign({}, payload, { parentNode: node }) // we update here because we only want to pass the parent along for the next iteration
      node.children = decorateTree(node.children, updatedPayload)
    }

    return node
  })

  return mapped
}

export function getChildrenNodes (node, excludeParentNodes = false) {
  let children = flattenTree(node)

  if (excludeParentNodes) {
    _.remove(children, node => !_.isEmpty(node.children)) // mutates the given array
  }

  return children
}

class Tree extends Component {
  static propTypes = {
    treeNodes: React.PropTypes.array.isRequired,
    onSelectionsChange: React.PropTypes.func.isRequired,
    selectedTerms: React.PropTypes.array.isRequired,
    hideDeselectAll: React.PropTypes.bool,
    includeParentNodes: React.PropTypes.bool.isRequired,
    filterTerm: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    let { treeNodes, selectedTerms } = this.props
    let flat = getFlattenedTree(treeNodes)

    if (flat.length > 0) {
      let allTerms = _.map(flat, 'name')
      let terms = (_.isEmpty(selectedTerms)) ? allTerms : selectedTerms
      this.selectTerms(terms)
    }
  }

  componentDidUpdate (prevProps) { // select all by default happens in here
    let { includeParentNodes, selectedTerms, treeNodes } = this.props
    let flat = getFlattenedTree(treeNodes)

    if (prevProps.includeParentNodes !== includeParentNodes) { // include parent nodes was toggled, so we manually select those extra terms {
      let selectedNodes = _.filter(flat, node => _.includes(selectedTerms, node.name))
      let terms = _.map(selectedNodes, 'name')
      this.selectTerms(terms)
    }

    // when the tree changes, we select all terms by default
    if (prevProps.treeNodes.length !== this.props.treeNodes.length) {
      let allTerms = _.map(flat, 'name')
      let terms = (_.isEmpty(selectedTerms)) ? allTerms : selectedTerms
      this.selectTerms(terms)
    }
  }

  shouldComponentUpdate (nextProps) {
    let flat = { current: [], next: [] }
    let visibles = _.clone(flat)

    flat.current = getFlattenedTree(this.props.treeNodes)
    flat.next = getFlattenedTree(nextProps.treeNodes)

    visibles.current = _.filter(flat.current, node => node && node.visible)
    visibles.next = _.filter(flat.next, node => node && node.visible)

    let newNodes = this.props.treeNodes.length !== nextProps.treeNodes.length

    let currentVisibleNames = _.map(visibles.current, 'name')
    let nextVisibleNames = _.map(visibles.next, 'name')

    let newVisibles = !_.isEmpty(_.difference(currentVisibleNames, nextVisibleNames)) ||
      !_.isEmpty(_.difference(nextVisibleNames, currentVisibleNames))

    let newTerms = this.props.selectedTerms.length !== nextProps.selectedTerms.length
    let leafNodesToggled = this.props.includeParentNodes !== nextProps.includeParentNodes

    let differs = newNodes || newVisibles || newTerms || leafNodesToggled

    return differs
  }

  selectTerms (selectedTerms) {
    let { treeNodes, includeParentNodes, onSelectionsChange } = this.props

    let flat = getFlattenedTree(treeNodes)
    let selectedNodes = _.filter(flat, node => _.includes(selectedTerms, node.name))
    let parents = _.map(getParentsForList(selectedNodes), 'name')
    let terms = (includeParentNodes) ? _.union(parents, selectedTerms) : _.without(selectedTerms, ...parents)

    onSelectionsChange(_.uniq(terms))
  }

  handleLeafClick (node) {
    let { selectedTerms } = this.props

    let unchecking = _.includes(selectedTerms, node.name)
    let terms = (unchecking) ? _.difference(selectedTerms, [node.name]) : _.union(selectedTerms, [node.name])

    this.selectTerms(terms)
  }

  handleParentClick (node) {
    let { selectedTerms } = this.props
    let children = _.map(getChildrenNodes(node), 'name')

    // unchecking only if all children are already selected
    // if some children are selected, we want to treat that as checking the parent
    let selected = this.areChildrenSelected(node)
    let terms = (selected.all) ? _.without(selectedTerms, ...children) : _.union(selectedTerms, children)

    this.selectTerms(terms)
  }

  handleDeselectAll () {
    this.props.onSelectionsChange([])
  }

  selectAll () {
    let flat = getFlattenedTree(this.props.treeNodes)
    this.props.onSelectionsChange(_.map(flat, 'name'))
  }

  areChildrenSelected (node) {
    let { selectedTerms } = this.props

    let children = _.uniq(_.map(getChildrenNodes(node, true), 'name'))
    let childrenSelected = _.intersection(children, selectedTerms)

    return {
      all: childrenSelected.length === children.length,
      some: childrenSelected.length > 0 && childrenSelected.length !== children.length,
      none: childrenSelected.length === 0
    }
  }

  getParentCheckbox (node) {
    let image = 'images/checkbox-'
    let selected = this.areChildrenSelected(node)

    if (selected.all) {
      image += 'checked.png'
    } else if (selected.some) {
      image += 'indeterminate.png'
    } else if (selected.none) {
      image += 'unchecked.png'
    }

    let props = {
      key: node.id,
      src: image
    }

    return <img {...props} />
  }

  getLeafCheckbox (node) {
    let { selectedTerms } = this.props
    let image = 'images/checkbox-unchecked.png'

    if (_.includes(selectedTerms, node.name)) {
      image = 'images/checkbox-checked.png'
    }

    let props = {
      key: node.id,
      src: image
    }

    return <img {...props} />
  }

  createParentNodeLabel (node) {
    let css = 'label-checkbox'
    if (_.isEmpty(node.children)) css += ' leaf-node'

    let children = getChildrenNodes(node)

    return <div className={css}
                onClick={this.handleParentClick.bind(this, node)}>
      {this.getParentCheckbox(node)}
      <div className="label-container">
        <span className="label">{node.name} ({children.length})</span>
      </div>
    </div>
  }

  createLeafNode (node) {
    return <div className="leaf-node"
                key={node.id}
                onClick={this.handleLeafClick.bind(this, node)}>
      {this.getLeafCheckbox(node)}
      <div className="label-container">
        <span className="label">{node.name}</span>
      </div>
    </div>
  }

  createTree (nodes = []) {
    let tree = nodes.map((node) => {
      let id = node.id || node.name

      let css = (node.visible) ? 'show' : 'hide'

      if (_.isEmpty(node.children)) {
        return <div className={css} key={id}>
                {this.createLeafNode(node)}
              </div>
      } else {
        let { treeNodes, filterTerm } = this.props
        let treeExpanded = false

        if (!_.isEmpty(filterTerm)) {
          let matches = _.map(getVisibleMatches(treeNodes, filterTerm), 'name')
          treeExpanded = _.includes(matches, node.name)
        }

        if (node.name === 'all') treeExpanded = true // override for "all"

        let props = {
          nodeLabel: this.createParentNodeLabel(node)
        }

        if (_.isEmpty(filterTerm)) {
          props.defaultCollapsed = !treeExpanded
        } else {
          // collapsed is the "controlled" version of defaultCollapsed
          props.collapsed = !treeExpanded
        }

        return <div className={css} key={id}>
          <TreeView {...props}>
            {this.createTree(node.children)}
          </TreeView>
        </div>
      }
    }, this)

    return tree
  }

  getDeselectAll () {
    let { hideDeselectAll, selectedTerms } = this.props

    if (hideDeselectAll) return

    return (<a className="deselect-all" onClick={this.handleDeselectAll.bind(this)}>
      Deselect All ({selectedTerms.length})
    </a>)
  }

  render () {
    let { treeNodes } = this.props

    return <div className="tree">
      {this.getDeselectAll()}
      {this.createTree(treeNodes)}
    </div>
  }
}

class FilterTree extends Component {
  static propTypes = {
    treeNodes: React.PropTypes.array.isRequired,
    onSelectionsChange: React.PropTypes.func.isRequired,
    onTypeaheadChange: React.PropTypes.func.isRequired,
    selectedTerms: React.PropTypes.array.isRequired,
    hideDeselectAll: React.PropTypes.bool,
    includeParentNodes: React.PropTypes.bool.isRequired,
    filterTerm: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    this.originalTree = decorateTree(this.props.treeNodes)
  }

  componentWillReceiveProps (nextProps) {
    if (!treesAreEqual(this.props.treeNodes, nextProps.treeNodes) && !_.isEmpty(nextProps.treeNodes)) {
      this.originalTree = decorateTree(_.clone(nextProps.treeNodes))
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
      hideDeselectAll,
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

        <span className="separator"></span>

        <Tree {...this.props} />
      </div>
    )
  }
}

export default FilterTree
