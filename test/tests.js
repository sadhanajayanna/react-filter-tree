import _ from 'lodash'
import { expect } from 'chai'
import mockTree from './mock-tree'
import {
  getFlattenedTree,
  decorateTree,
  getToggledTree,
  getChildrenNodes,
  treesAreEqual,
  getParentsForList,
  getVisibleMatches,
  getSubTree
} from '../src/FilterTree'

let tree, flat
let oneMatch, manyMatches = []
let totalNodes = 21
const ONE_MATCH = '13'
const MANY_MATCHES = 'ol'

describe('tree utilities', function () {
  beforeEach(function () {
    tree = decorateTree(mockTree)
    flat = getFlattenedTree(tree)
    oneMatch = getVisibleMatches(tree, ONE_MATCH)
    manyMatches = getVisibleMatches(tree, MANY_MATCHES)
  })

  it('flattens the tree with a flag to getNodes', function () {
    expect(tree.length).to.equal(1)
    expect(flat.length).to.equal(totalNodes)
  })

  it('has "all" as the first and only element of the tree', function () {
    expect(_.first(tree).name).to.equal('all')
    expect(_.first(tree).name).to.equal(_.first(flat).name)
  })

  it('keeps the same total nodes when flattening', function () {
    let nodes = getFlattenedTree(tree, flat)
    expect(flat.length).to.equal(nodes.length)
  })

  it('should return the same tree shape for getToggledTree', function () {
    let toggledTree = getToggledTree(tree, MANY_MATCHES)
    let flatToggled = getFlattenedTree(toggledTree)

    expect(tree.length).to.equal(toggledTree.length)
    expect(_.first(toggledTree).id).to.equal(_.first(tree).id)
    expect(flatToggled.length).to.equal(flat.length)
    expect(_.first(flatToggled).id).to.equal(_.first(flat).id)
  })

  it('getNodes should give me the exact same tree structure back', function () {
    let toggledTree = getToggledTree(tree, MANY_MATCHES)
    expect(treesAreEqual(toggledTree, tree)).to.equal(true)

    let amountToChop = 4
    let modded = _.clone(tree, true)
    modded[0].children[0].children[0].children = modded[0].children[0].children[0].children.slice(amountToChop)
    let flatModded = getFlattenedTree(modded)

    // I happen to know that the three children I'm removing have no further children, meaning we're only dropping three total nodes
    expect(flatModded.length).to.equal(totalNodes - amountToChop)
  })

  it('maintains the tree structure during decoration', function () {
    expect(tree.length).to.equal(mockTree.length)
    expect(flat.length).to.equal(getFlattenedTree(mockTree).length)
  })

  it('gets a list of matches for a given string', function () {
    const parentNodes = 4
    expect(oneMatch.length).to.equal(parentNodes)
    expect(manyMatches.length).to.equal(8) // derived from hand-counting (inclues parent nodes)
  })

  it('maintains the same tree structure when given matches', function () {
    let toggledTree = getToggledTree(tree, MANY_MATCHES)
    expect(treesAreEqual(tree, toggledTree)).to.equal(true)
  })

  it('has more visible nodes than matches (because of parents)', function () {
    expect(oneMatch.length).to.be.below(getParentsForList(oneMatch).length)
    expect(manyMatches.length).to.be.below(getParentsForList(manyMatches).length)
  })

  it('visible nodes list includes matches and their parents', function () {
    let matchesNames = _.map(manyMatches, 'name')
    let parents = _.map(getParentsForList(manyMatches), 'name')

    let unique = _.union(parents, matchesNames)
    expect(unique.length).to.equal(_.uniq(matchesNames).length)
  })

  it('getVisibleMatches should return the same number of visible nodes in the tree', function () {
    let toggledTree = getToggledTree(tree, MANY_MATCHES)
    let flatToggled = getFlattenedTree(toggledTree)
    let visible = _.filter(flatToggled, node => node.visible)

    expect(visible.length).to.equal(8) // derived from hand-counting
  })

  it('getToggledTree should also handle an array of terms ', function () {
    let toggledTree = getToggledTree(tree, [MANY_MATCHES, 'lo'])
    let flatToggled = getFlattenedTree(toggledTree)
    let visible = _.filter(flatToggled, node => node.visible)

    expect(visible.length).to.equal(11) // derived from hand-counting
  })

  it('should have an empty tree for a bad term', function () {
    let toggledTree = getToggledTree(tree, 'asdfasdfasdfasdfas')
    let flatToggled = getFlattenedTree(toggledTree)
    let visible = _.filter(flatToggled, node => node.visible)

    expect(visible.length).to.equal(0)
  })

  it('gets me some child nodes', function () {
    let node = _.find(flat, { name: 'military'})
    let children = getChildrenNodes(node)
    let childrenNames = _.map(children, 'name')
    let expectNames = [
      '13 Hours: The Secret Soldiers of Benghazi',
      'The Hurt Locker',
      'American Sniper',
      'Lone Survivor',
      'Zero Dark Thiry'
    ]

    let diff = _.difference(childrenNames, expectNames)

    expect(diff.length).to.equal(0)
    expect(childrenNames.length).to.equal(expectNames.length)
  })

  it('gets matches given a flat tree', function () {
    let matches = getVisibleMatches(tree, 'ou')
    expect(matches.length).to.equal(6) // derived from hand-counting
  })

  it('finds matches for genes', function () {
    let toggled = getToggledTree(tree, 'ou')
    let flatToggled = getFlattenedTree(toggled)
    let visible = _.filter(flatToggled, node => node.visible)
    expect(visible.length).to.equal(6)
  })

  it('gets only parent nodes for a given list of nodes', function () {
    let deepParent = tree[0].children[1]
    let deepChild = deepParent.children[0] // Neighbors
    let expectedParents = [
      'comedy',
      'all'
    ]

    let parents = _.map(getParentsForList([deepChild]), 'name')

    expect(expectedParents.length).to.equal(parents.length)
    expect(_.without(parents, ...expectedParents).length).to.equal(0)
  })
})
