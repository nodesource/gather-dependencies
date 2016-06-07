gather-dependencies
===================

Similar in API to `npm shrinkwrap` producing a object structure with each type of dependency installed.

* dependencies
* devDependencies
* optionalDependencies
* peerDependencies

See the sample `npm-shrinkwrap.json` in ./test/fixtures/with-npm-install. With a shrinkwrapped file, dependencies saved with `npm shrinkwrap --dev` are grouped with other dependencies.

*`npm-shrinkwrap.json`*
```javascript
{
  "name": "without-npm-install",
  "version": "1.0.0",
  "dependencies": {
    "client-request": {
      "version": "1.0.1",
      "from": "client-request@*",
      "resolved": "https://registry.npmjs.org/client-request/-/client-request-1.0.1.tgz"
    },
    "tape": {
      "version": "4.2.0",
      "from": "tape@*",
      "resolved": "https://registry.npmjs.org/tape/-/tape-4.2.0.tgz",
    ...
```

`gather-dependencies` does not care about the resolved registry URI.

`gather-dependencies` adds the field `requestedVersion` for the user specified version in `package.json`.

Leaf nodes that do not have `version` or `from` already have the dependency satisfied. `npm shrinkwrap` ignores these entries.

## Examples

See [examples]('./examples').

*`gather-dependencies-report.json`*
```javascript
{
  "name": "gather-dependencies",
  "version": "1.0.0",
  "dependencies": {
    "read-package-tree": {
      "requestedVersion": "~5.1.0",
      "version": "5.1.0",
      "from": "read-package-tree@*",
      "dependencies": {
        "debuglog": {
          "requestedVersion": "^1.0.1",
          "version": "1.0.1",
          "from": "debuglog@>=1.0.1 <2.0.0"
        },
    ...
```

## Authors and Contributors

<table><tbody>
<tr><th align="left">Dan Shaw</th><td><a href="https://github.com/dshaw">GitHub/dshaw</a></td><td><a href="http://twitter.com/dshaw">Twitter/@dshaw</a></td></tr>
<tr><th align="left">Julian Duque</th><td><a href="https://github.com/julianduque">GitHub/julianduque</a></td><td><a href="http://twitter.com/julian_duque">Twitter/@julian_duque</a></td></tr>
<tr><th align="left">Daniel Aristizabal</th><td><a href="https://github.com/cronopio">GitHub/cronopio</a></td><td><a href="http://twitter.com/cronopio2">Twitter/@cronopio2</a></td></tr>
<tr><th align="left">Adrian Estrada</th><td><a href="https://github.com/edsadr">GitHub/edsadr</a></td><td><a href="http://twitter.com/edsadr">Twitter/@edsadr</a></td></tr>
</tbody></table>

Contributions are welcomed from anyone wanting to improve this project!

## License & Copyright

**gather-dependencies** is Copyright (c) 2016 NodeSource and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
