(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "react"], factory);
	else if(typeof exports === 'object')
		exports["FilterTree"] = factory(require("lodash"), require("react"));
	else
		root["FilterTree"] = factory(root["lodash"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.getParents = getParents;
	exports.treesAreEqual = treesAreEqual;
	exports.getVisibleMatches = getVisibleMatches;
	exports.getParentsForList = getParentsForList;
	exports.getToggledTree = getToggledTree;
	exports.getFlattenedTree = getFlattenedTree;
	exports.decorateTree = decorateTree;
	exports.getChildrenNodes = getChildrenNodes;
	
	var _lodash = __webpack_require__(2);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactTreeview = __webpack_require__(4);
	
	var _reactTreeview2 = _interopRequireDefault(_reactTreeview);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function flattenTree(parentNode) {
	  var list = _lodash2.default.has(parentNode, 'children') && parentNode.children.length > 0 ? parentNode.children : [parentNode];
	
	  var nodes = _lodash2.default.map(list, function (node) {
	    if (!node) return;
	
	    if (_lodash2.default.has(node, 'children') && node.children.length > 0) {
	      return [node].concat(_toConsumableArray(flattenTree(node)));
	    }
	
	    return node;
	  });
	
	  return _lodash2.default.flattenDeep(nodes);
	}
	
	function uniq(nodes) {
	  return _lodash2.default.uniq(nodes, function (node) {
	    return node.ref;
	  });
	}
	
	function getParents(node) {
	  var list = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	  var firstPass = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	  if (!firstPass) list.push(node);
	
	  if (node.parentNode) {
	    getParents(node.parentNode, list, false);
	  }
	
	  return _lodash2.default.flattenDeep(list);
	}
	
	function treesAreEqual(treeA, treeB) {
	  if (!_lodash2.default.isArray(treeA) || !_lodash2.default.isArray(treeB)) throw new Error('both supplied trees must be arrays');
	
	  if (treeA.length !== treeB.length) return false;
	
	  return _lodash2.default.every(treeA, function (item, index) {
	    var itemA = treeA[index];
	    var itemB = treeB[index];
	
	    if (!_lodash2.default.isEmpty(item.children)) {
	      return treesAreEqual(itemA.children, itemB.children);
	    } else {
	      return itemA.id === itemB.id;
	    }
	  });
	}
	
	function getVisibleMatches(tree, text) {
	  if (_lodash2.default.isEmpty(text)) return [];
	
	  function contains(name, terms) {
	    var filtered = _lodash2.default.filter(terms, function (term) {
	      return _lodash2.default.includes(name, _lodash2.default.lowerCase(term));
	    });
	
	    return !_lodash2.default.isEmpty(filtered);
	  }
	
	  var flat = getFlattenedTree(tree);
	  var matches = _lodash2.default.filter(flat, function (node) {
	    var name = _lodash2.default.lowerCase(node.name);
	
	    if (_lodash2.default.isString(text)) {
	      return name.indexOf(_lodash2.default.lowerCase(text)) > -1;
	    } else if (_lodash2.default.isArray(text)) {
	      return contains(name, text);
	    }
	  });
	
	  var parents = getParentsForList(matches);
	  var visible = _lodash2.default.union(matches, parents);
	  return uniq(visible);
	}
	
	function getParentsForList(list) {
	  var mapped = _lodash2.default.map(list, function (node) {
	    return getParents(node);
	  });
	
	  var flat = _lodash2.default.flattenDeep(mapped);
	  return flat;
	}
	
	function getToggledTree() {
	  var originalTree = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	  var filterTerm = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
	  var matches = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
	
	  if (!matches) {
	    matches = getVisibleMatches(originalTree, filterTerm);
	  }
	
	  var tree = _lodash2.default.map(originalTree, function (item) {
	    var node = _lodash2.default.assign({}, item);
	
	    if (!_lodash2.default.isEmpty(filterTerm)) {
	      var nodeMatches = _lodash2.default.filter(matches, function (match) {
	        return match.name === node.name;
	      });
	      node.visible = !_lodash2.default.isEmpty(nodeMatches);
	    } else {
	      // not looking for matches, show whole tree
	      node.visible = true;
	    }
	
	    if (node && !_lodash2.default.isEmpty(node.children)) {
	      node.children = getToggledTree(node.children, filterTerm, matches);
	    }
	
	    return node;
	  });
	
	  return tree;
	}
	
	function getFlattenedTree(tree) {
	  if (!_lodash2.default.isArray(tree)) throw new Error('getFlattenedTree expects the tree to be an array');
	
	  var parentNode = _lodash2.default.first(tree); // TODO this only makes sense because we have one root node (if plain object use it, else array grab first, else throw error)
	  var list = [];
	
	  if (_lodash2.default.has(parentNode, 'children')) {
	    var flat = flattenTree(parentNode);
	    list = [parentNode].concat(_toConsumableArray(flat));
	  } else {
	    list = tree;
	  }
	
	  return list;
	}
	
	function decorateTree(rawTree, payload) {
	  // so festive
	  var mapped = _lodash2.default.map(rawTree, function (node) {
	    node = _lodash2.default.isString(node) ? { name: node } : node;
	
	    node = _lodash2.default.assign({}, node, payload, {
	      visible: true,
	      ref: _lodash2.default.random(0, Date.now())
	    });
	
	    if (!_lodash2.default.isEmpty(node.children)) {
	      var updatedPayload = _lodash2.default.assign({}, payload, { parentNode: node }); // we update here because we only want to pass the parent along for the next iteration
	      node.children = decorateTree(node.children, updatedPayload);
	    }
	
	    return node;
	  });
	
	  return mapped;
	}
	
	function getChildrenNodes(node) {
	  var excludeParentNodes = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	  var children = flattenTree(node);
	
	  if (excludeParentNodes) {
	    _lodash2.default.remove(children, function (node) {
	      return !_lodash2.default.isEmpty(node.children);
	    }); // mutates the given array
	  }
	
	  return children;
	}
	
	var Tree = function (_Component) {
	  _inherits(Tree, _Component);
	
	  function Tree() {
	    _classCallCheck(this, Tree);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Tree).apply(this, arguments));
	  }
	
	  _createClass(Tree, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _props = this.props;
	      var treeNodes = _props.treeNodes;
	      var selectedTerms = _props.selectedTerms;
	
	      var flat = getFlattenedTree(treeNodes);
	
	      if (flat.length > 0) {
	        var allTerms = _lodash2.default.map(flat, 'name');
	        var terms = _lodash2.default.isEmpty(selectedTerms) ? allTerms : selectedTerms;
	        this.selectTerms(terms);
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      // select all by default happens in here
	      var _props2 = this.props;
	      var includeParentNodes = _props2.includeParentNodes;
	      var selectedTerms = _props2.selectedTerms;
	      var treeNodes = _props2.treeNodes;
	
	      var flat = getFlattenedTree(treeNodes);
	
	      if (prevProps.includeParentNodes !== includeParentNodes) {
	        // include parent nodes was toggled, so we manually select those extra terms {
	        var selectedNodes = _lodash2.default.filter(flat, function (node) {
	          return _lodash2.default.includes(selectedTerms, node.name);
	        });
	        var terms = _lodash2.default.map(selectedNodes, 'name');
	        this.selectTerms(terms);
	      }
	
	      // when the tree changes, we select all terms by default
	      if (prevProps.treeNodes.length !== this.props.treeNodes.length) {
	        var allTerms = _lodash2.default.map(flat, 'name');
	        var _terms = _lodash2.default.isEmpty(selectedTerms) ? allTerms : selectedTerms;
	        this.selectTerms(_terms);
	      }
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      var flat = { current: [], next: [] };
	      var visibles = _lodash2.default.clone(flat);
	
	      flat.current = getFlattenedTree(this.props.treeNodes);
	      flat.next = getFlattenedTree(nextProps.treeNodes);
	
	      visibles.current = _lodash2.default.filter(flat.current, function (node) {
	        return node && node.visible;
	      });
	      visibles.next = _lodash2.default.filter(flat.next, function (node) {
	        return node && node.visible;
	      });
	
	      var newNodes = this.props.treeNodes.length !== nextProps.treeNodes.length;
	
	      var currentVisibleNames = _lodash2.default.map(visibles.current, 'name');
	      var nextVisibleNames = _lodash2.default.map(visibles.next, 'name');
	
	      var newVisibles = !_lodash2.default.isEmpty(_lodash2.default.difference(currentVisibleNames, nextVisibleNames)) || !_lodash2.default.isEmpty(_lodash2.default.difference(nextVisibleNames, currentVisibleNames));
	
	      var newTerms = this.props.selectedTerms.length !== nextProps.selectedTerms.length;
	      var leafNodesToggled = this.props.includeParentNodes !== nextProps.includeParentNodes;
	
	      var differs = newNodes || newVisibles || newTerms || leafNodesToggled;
	
	      return differs;
	    }
	  }, {
	    key: 'selectTerms',
	    value: function selectTerms(selectedTerms) {
	      var _props3 = this.props;
	      var treeNodes = _props3.treeNodes;
	      var includeParentNodes = _props3.includeParentNodes;
	      var onSelectionsChange = _props3.onSelectionsChange;
	
	
	      var flat = getFlattenedTree(treeNodes);
	      var selectedNodes = _lodash2.default.filter(flat, function (node) {
	        return _lodash2.default.includes(selectedTerms, node.name);
	      });
	      var parents = _lodash2.default.map(getParentsForList(selectedNodes), 'name');
	      var terms = includeParentNodes ? _lodash2.default.union(parents, selectedTerms) : _lodash2.default.without.apply(_lodash2.default, [selectedTerms].concat(_toConsumableArray(parents)));
	
	      onSelectionsChange(_lodash2.default.uniq(terms));
	    }
	  }, {
	    key: 'handleLeafClick',
	    value: function handleLeafClick(node) {
	      var selectedTerms = this.props.selectedTerms;
	
	
	      var unchecking = _lodash2.default.includes(selectedTerms, node.name);
	      var terms = unchecking ? _lodash2.default.difference(selectedTerms, [node.name]) : _lodash2.default.union(selectedTerms, [node.name]);
	
	      this.selectTerms(terms);
	    }
	  }, {
	    key: 'handleParentClick',
	    value: function handleParentClick(node) {
	      var selectedTerms = this.props.selectedTerms;
	
	      var children = _lodash2.default.map(getChildrenNodes(node), 'name');
	
	      // unchecking only if all children are already selected
	      // if some children are selected, we want to treat that as checking the parent
	      var selected = this.areChildrenSelected(node);
	      var terms = selected.all ? _lodash2.default.without.apply(_lodash2.default, [selectedTerms].concat(_toConsumableArray(children))) : _lodash2.default.union(selectedTerms, children);
	
	      this.selectTerms(terms);
	    }
	  }, {
	    key: 'handleDeselectAll',
	    value: function handleDeselectAll() {
	      this.props.onSelectionsChange([]);
	    }
	  }, {
	    key: 'selectAll',
	    value: function selectAll() {
	      var flat = getFlattenedTree(this.props.treeNodes);
	      this.props.onSelectionsChange(_lodash2.default.map(flat, 'name'));
	    }
	  }, {
	    key: 'areChildrenSelected',
	    value: function areChildrenSelected(node) {
	      var selectedTerms = this.props.selectedTerms;
	
	
	      var children = _lodash2.default.uniq(_lodash2.default.map(getChildrenNodes(node, true), 'name'));
	      var childrenSelected = _lodash2.default.intersection(children, selectedTerms);
	
	      return {
	        all: childrenSelected.length === children.length,
	        some: childrenSelected.length > 0 && childrenSelected.length !== children.length,
	        none: childrenSelected.length === 0
	      };
	    }
	  }, {
	    key: 'getParentCheckbox',
	    value: function getParentCheckbox(node) {
	      var image = 'images/checkbox-';
	      var selected = this.areChildrenSelected(node);
	
	      if (selected.all) {
	        image += 'checked.png';
	      } else if (selected.some) {
	        image += 'indeterminate.png';
	      } else if (selected.none) {
	        image += 'unchecked.png';
	      }
	
	      var props = {
	        key: node.id,
	        src: image
	      };
	
	      return _react2.default.createElement('img', props);
	    }
	  }, {
	    key: 'getLeafCheckbox',
	    value: function getLeafCheckbox(node) {
	      var selectedTerms = this.props.selectedTerms;
	
	      var image = 'images/checkbox-unchecked.png';
	
	      if (_lodash2.default.includes(selectedTerms, node.name)) {
	        image = 'images/checkbox-checked.png';
	      }
	
	      var props = {
	        key: node.id,
	        src: image
	      };
	
	      return _react2.default.createElement('img', props);
	    }
	  }, {
	    key: 'createParentNodeLabel',
	    value: function createParentNodeLabel(node) {
	      var css = 'label-checkbox';
	      if (_lodash2.default.isEmpty(node.children)) css += ' leaf-node';
	
	      var children = getChildrenNodes(node);
	
	      return _react2.default.createElement(
	        'div',
	        { className: css,
	          onClick: this.handleParentClick.bind(this, node) },
	        this.getParentCheckbox(node),
	        _react2.default.createElement(
	          'div',
	          { className: 'label-container' },
	          _react2.default.createElement(
	            'span',
	            { className: 'label' },
	            node.name,
	            ' (',
	            children.length,
	            ')'
	          )
	        )
	      );
	    }
	  }, {
	    key: 'createLeafNode',
	    value: function createLeafNode(node) {
	      return _react2.default.createElement(
	        'div',
	        { className: 'leaf-node',
	          key: node.id,
	          onClick: this.handleLeafClick.bind(this, node) },
	        this.getLeafCheckbox(node),
	        _react2.default.createElement(
	          'div',
	          { className: 'label-container' },
	          _react2.default.createElement(
	            'span',
	            { className: 'label' },
	            node.name
	          )
	        )
	      );
	    }
	  }, {
	    key: 'createTree',
	    value: function createTree() {
	      var _this2 = this;
	
	      var nodes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	      var tree = nodes.map(function (node) {
	        var id = node.id || node.name;
	
	        var css = node.visible ? 'show' : 'hide';
	
	        if (_lodash2.default.isEmpty(node.children)) {
	          return _react2.default.createElement(
	            'div',
	            { className: css, key: id },
	            _this2.createLeafNode(node)
	          );
	        } else {
	          var _props4 = _this2.props;
	          var treeNodes = _props4.treeNodes;
	          var filterTerm = _props4.filterTerm;
	
	          var treeExpanded = false;
	
	          if (!_lodash2.default.isEmpty(filterTerm)) {
	            var matches = _lodash2.default.map(getVisibleMatches(treeNodes, filterTerm), 'name');
	            treeExpanded = _lodash2.default.includes(matches, node.name);
	          }
	
	          if (node.name === 'all') treeExpanded = true; // override for "all"
	
	          var props = {
	            nodeLabel: _this2.createParentNodeLabel(node)
	          };
	
	          if (_lodash2.default.isEmpty(filterTerm)) {
	            props.defaultCollapsed = !treeExpanded;
	          } else {
	            // collapsed is the "controlled" version of defaultCollapsed
	            props.collapsed = !treeExpanded;
	          }
	
	          return _react2.default.createElement(
	            'div',
	            { className: css, key: id },
	            _react2.default.createElement(
	              _reactTreeview2.default,
	              props,
	              _this2.createTree(node.children)
	            )
	          );
	        }
	      }, this);
	
	      return tree;
	    }
	  }, {
	    key: 'getDeselectAll',
	    value: function getDeselectAll() {
	      var _props5 = this.props;
	      var hideDeselectAll = _props5.hideDeselectAll;
	      var selectedTerms = _props5.selectedTerms;
	
	
	      if (hideDeselectAll) return;
	
	      return _react2.default.createElement(
	        'a',
	        { className: 'deselect-all', onClick: this.handleDeselectAll.bind(this) },
	        'Deselect All (',
	        selectedTerms.length,
	        ')'
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var treeNodes = this.props.treeNodes;
	
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'tree' },
	        this.getDeselectAll(),
	        this.createTree(treeNodes)
	      );
	    }
	  }]);
	
	  return Tree;
	}(_react.Component);
	
	Tree.propTypes = {
	  treeNodes: _react2.default.PropTypes.array.isRequired,
	  onSelectionsChange: _react2.default.PropTypes.func.isRequired,
	  selectedTerms: _react2.default.PropTypes.array.isRequired,
	  hideDeselectAll: _react2.default.PropTypes.bool,
	  includeParentNodes: _react2.default.PropTypes.bool.isRequired,
	  filterTerm: _react2.default.PropTypes.string.isRequired
	};
	
	var FilterTree = function (_Component2) {
	  _inherits(FilterTree, _Component2);
	
	  function FilterTree() {
	    _classCallCheck(this, FilterTree);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FilterTree).apply(this, arguments));
	  }
	
	  _createClass(FilterTree, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.originalTree = decorateTree(this.props.treeNodes);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (!treesAreEqual(this.props.treeNodes, nextProps.treeNodes) && !_lodash2.default.isEmpty(nextProps.treeNodes)) {
	        this.originalTree = decorateTree(_lodash2.default.clone(nextProps.treeNodes));
	      }
	    }
	  }, {
	    key: 'handleTypeaheadChange',
	    value: function handleTypeaheadChange(event) {
	      var filterTerm = event.currentTarget.value;
	      var toggled = getToggledTree(this.originalTree, filterTerm);
	      this.props.onTypeaheadChange(toggled, filterTerm);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props6 = this.props;
	      var treeNodes = _props6.treeNodes;
	      var onSelectionsChange = _props6.onSelectionsChange;
	      var selectedTerms = _props6.selectedTerms;
	      var hideDeselectAll = _props6.hideDeselectAll;
	      var includeParentNodes = _props6.includeParentNodes;
	      var filterTerm = _props6.filterTerm;
	
	
	      var debounced = _lodash2.default.debounce(this.handleTypeaheadChange.bind(this), 250);
	
	      var typeAheadHandler = function typeAheadHandler(event) {
	        // React will clear out that event, so we need to clone it the first time so that it's available to our
	        // debounced function, otherwise, the debounced method will receive null for an event object... which is bad
	        debounced(_lodash2.default.clone(event));
	      };
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'filter-tree' },
	        _react2.default.createElement(
	          'div',
	          { className: 'input-search-container' },
	          _react2.default.createElement('input', { type: 'search', onChange: typeAheadHandler.bind(this) })
	        ),
	        _react2.default.createElement('span', { className: 'separator' }),
	        _react2.default.createElement(Tree, this.props)
	      );
	    }
	  }]);
	
	  return FilterTree;
	}(_react.Component);
	
	FilterTree.propTypes = {
	  treeNodes: _react2.default.PropTypes.array.isRequired,
	  onSelectionsChange: _react2.default.PropTypes.func.isRequired,
	  onTypeaheadChange: _react2.default.PropTypes.func.isRequired,
	  selectedTerms: _react2.default.PropTypes.array.isRequired,
	  hideDeselectAll: _react2.default.PropTypes.bool,
	  includeParentNodes: _react2.default.PropTypes.bool.isRequired,
	  filterTerm: _react2.default.PropTypes.string.isRequired
	};
	exports.default = FilterTree;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var TreeView = _react2['default'].createClass({
	  displayName: 'TreeView',
	
	  propTypes: {
	    collapsed: _react.PropTypes.bool,
	    defaultCollapsed: _react.PropTypes.bool,
	    nodeLabel: _react.PropTypes.node.isRequired,
	    className: _react.PropTypes.string,
	    itemClassName: _react.PropTypes.string
	  },
	
	  getInitialState: function getInitialState() {
	    return { collapsed: this.props.defaultCollapsed };
	  },
	
	  handleClick: function handleClick() {
	    this.setState({ collapsed: !this.state.collapsed });
	    if (this.props.onClick) {
	      var _props;
	
	      (_props = this.props).onClick.apply(_props, arguments);
	    }
	  },
	
	  render: function render() {
	    var _props2 = this.props;
	    var _props2$collapsed = _props2.collapsed;
	    var collapsed = _props2$collapsed === undefined ? this.state.collapsed : _props2$collapsed;
	    var _props2$className = _props2.className;
	    var className = _props2$className === undefined ? '' : _props2$className;
	    var _props2$itemClassName = _props2.itemClassName;
	    var itemClassName = _props2$itemClassName === undefined ? '' : _props2$itemClassName;
	    var nodeLabel = _props2.nodeLabel;
	    var children = _props2.children;
	
	    var rest = _objectWithoutProperties(_props2, ['collapsed', 'className', 'itemClassName', 'nodeLabel', 'children']);
	
	    var arrowClassName = 'tree-view_arrow';
	    var containerClassName = 'tree-view_children';
	    if (collapsed) {
	      arrowClassName += ' tree-view_arrow-collapsed';
	      containerClassName += ' tree-view_children-collapsed';
	    }
	
	    var arrow = _react2['default'].createElement('div', _extends({}, rest, {
	      className: className + ' ' + arrowClassName,
	      onClick: this.handleClick }));
	
	    return _react2['default'].createElement(
	      'div',
	      { className: 'tree-view' },
	      _react2['default'].createElement(
	        'div',
	        { className: 'tree-view_item ' + itemClassName },
	        arrow,
	        nodeLabel
	      ),
	      _react2['default'].createElement(
	        'div',
	        { className: containerClassName },
	        children
	      )
	    );
	  }
	});
	
	exports['default'] = TreeView;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-filter-tree.map