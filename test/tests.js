import _ from 'lodash'
import { expect } from 'chai'
import { diseaseTree } from './mock-disease-tree'
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
let totalNodes = 494
const BONE = 'bone'
const EYE_INTRAOCULAR_MELANOMA = 'eye intraocular melanoma'

describe('tree utilities', function () {
  beforeEach(function () {
    tree = decorateTree(diseaseTree.tree)
    flat = getFlattenedTree(tree)
    oneMatch = getVisibleMatches(tree, EYE_INTRAOCULAR_MELANOMA)
    manyMatches = getVisibleMatches(tree, BONE)
  })

  it('should have a parent node different than itself', function () {
    let randomSample = flat[_.random(1, flat.length)]
    let parent = randomSample.parentNode
    expect(parent.id).not.to.equal(randomSample.id)
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
    let toggledTree = getToggledTree(tree, EYE_INTRAOCULAR_MELANOMA)
    let flatToggled = getFlattenedTree(toggledTree)

    expect(tree.length).to.equal(toggledTree.length)
    expect(_.first(toggledTree).id).to.equal(_.first(tree).id)
    expect(flatToggled.length).to.equal(flat.length)
    expect(_.first(flatToggled).id).to.equal(_.first(flat).id)
  })

  it('getNodes should give me the exact same tree structure back', function () {
    let toggledTree = getToggledTree(tree, EYE_INTRAOCULAR_MELANOMA)
    expect(treesAreEqual(toggledTree, tree)).to.equal(true)

    let amountToChop = 4
    let modded = _.clone(tree, true)
    modded[0].children[0].children[0].children = modded[0].children[0].children[0].children.slice(amountToChop)
    let flatModded = getFlattenedTree(modded)

    // I happen to know that the three children I'm removing have no further children, meaning we're only dropping three total nodes
    expect(flatModded.length).to.equal(totalNodes - amountToChop)
  })

  it('maintains the tree structure during decoration', function () {
    expect(tree.length).to.equal(diseaseTree.tree.length)
    expect(flat.length).to.equal(getFlattenedTree(diseaseTree.tree).length)
  })

  it('gets a list of matches for a given string', function () {
    const parentNodes = 5
    expect(oneMatch.length).to.equal(parentNodes)
    expect(manyMatches.length).to.equal(39) // derived from hand-counting
  })

  it('maintains the same tree structure when given matches', function () {
    let toggledTree = getToggledTree(tree, EYE_INTRAOCULAR_MELANOMA)
    expect(treesAreEqual(tree, toggledTree)).to.equal(true)
  })

  it('has more visible nodes than matches (because of parents)', function () {
    expect(oneMatch.length).to.be.below(getParentsForList(oneMatch).length)
    expect(manyMatches.length).to.be.below(getParentsForList(manyMatches).length)
  })

  it('visible nodes list includes matches and their parents', function () {
    let parents = getParentsForList(manyMatches)
    let visible = getVisibleMatches(tree, BONE)
    let unique = _.uniq(_.union(parents, manyMatches), node => node.id)
    expect(unique.length).to.equal(visible.length)
  })

  it('getVisibleMatches should return the same number of visible nodes in the tree', function () {
    let toggledTree = getToggledTree(tree, 'leukemia')
    let matches = getVisibleMatches(tree, 'leukemia')
    let flatToggled = getFlattenedTree(toggledTree)
    let visible = _.filter(flatToggled, node => node.visible)

    expect(visible.length).to.equal(19) // derived from hand-counting
    expect(visible.length).to.equal(matches.length)
  })

  it('should have an empty tree for a bad term', function () {
    let toggledTree = getToggledTree(tree, 'asdfasdfasdfasdfas')
    let flatToggled = getFlattenedTree(toggledTree)
    let visible = _.filter(flatToggled, node => node.visible)

    expect(visible.length).to.equal(0)
  })

  it('gets me some child nodes', function () {
    let node = _.find(flat, { name: 'Bone marrow neoplasm'})
    let children = getChildrenNodes(node)
    let childrenNames = _.map(children, 'name')
    let expectNames = [
      'Bone marrow aplastic anemia',
      'Bone marrow mastocytosis',
      'Bone marrow myeloproliferative neoplasm (MPN)',
      'Bone marrow multiple myeloma',
      'Bone marrow plasmacytoma'
    ]
    let diff = _.difference(childrenNames, expectNames)

    expect(diff.length).to.equal(0)
    expect(childrenNames.length).to.equal(expectNames.length)
  })

  it('gets matches given a flat tree', function () {
    let matches = getVisibleMatches(tree, 'HI')
    expect(matches.length).to.equal(18)
  })

  it('finds matches for genes', function () {
    let toggled = getToggledTree(tree, 'HI')
    let flatToggled = getFlattenedTree(toggled)
    let visible = _.filter(flatToggled, node => node.visible)
    expect(visible.length).to.equal(18)
  })

  it('gets only parent nodes for a given list of nodes', function () {
    let deepParent = tree[0].children[1].children[1].children[0]
    let deepChild = deepParent.children[0] // Eye intraocular melanoma
    let expectedParents = [
      'Eye carcinoma',
      'Eye neoplasm',
      'Solid tumor',
      'all'
    ]

    let parents = _.map(getParentsForList([deepChild]), 'name')

    expect(expectedParents.length).to.equal(parents.length)
    expect(_.without(parents, ...expectedParents).length).to.equal(0)
  })
})
