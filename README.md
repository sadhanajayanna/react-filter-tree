# react-filter-tree

## Usage

Using the FilterTree component is relatively straightforward. The most important part is to have your tree in the right format; a basic/simple tree can be found in `/test/mock-tree.js`, which is the same tree used for the demo. You can see a example usage of the `<FilterTree>` component in `/demos/demo.js`, though here's a quick rundown of the props you can pass and what they mean.

- `treeNodes`: this is the actual tree itself.
- `onSelectionsChange`: when a user checks/unchecks anything in the tree, this will fire.
- `onTypeaheadChange`: when a user hits any key in the typeahead input field, this will fire.
- `includeParentNodes`: by default, the terms that are dispatched to `onSelectionsChange` _don't_ include the parent nodes' values. Simply flip this to `true` if you need those included.
- `selectedTerms`: instead of having the FilterTree component manage this internally, it's exposed as a property for you to override. This is primarily because it is not atypical to have an external component modify what terms are allowed/selected. The FilterTree component will iterate over the terms and setup the tree accordingly.
- `hideDeselectAll`: the "Deselect All" button-text at the top of the tree (under the input field) can be enabled/disabled with this prop.
- `filterTerm`: the term used to filter the tree down. Similar to `selectedTerms`, we allow this to be passed in so that external components can modify the term and it's still simple to pass it in.

## Development

```
nvm install
npm install
npm run build-demos
python -m SimpleHTTPServer
```

You should be able to reach the demo at: [http://localhost:8000/demo.html](http://localhost:8000/demo.html)

# Publishing Changes
1. Update the version in `package.json`
2. Run `npm run build`
3. Add a git tag for the same version, e.g. `git tag 2.1.1`
4. Don't forget to push up the tags too, e.g. `git push --tags`
5. Once everything is updated on GitHub, `npm publish`
