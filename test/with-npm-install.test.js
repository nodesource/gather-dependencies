var path = require('path')
var test = require('tap').test
var gatherDependencies = require('..')
var fixtures = path.resolve(__dirname, 'fixtures')

/**
 * Tests with npm install run on the directory
 */

test('with-npm-install', function cb (t) {
  var dir = path.resolve(fixtures, 'with-npm-install')
  var expectedJson = require(path.resolve(fixtures, 'with-npm-install.json'))

  gatherDependencies(dir, function cb (err, data) {
    if (err) throw err

    t.equal(data.name, expectedJson.name, 'top level name')
    t.equal(data.version, expectedJson.version, 'top level version')
    t.ok(data.dependencies, 'has dependencies')
    t.equal(Object.keys(data.dependencies).length, 1, 'dependency entries')
    t.ok(data.devDependencies, 'has devDependencies')
    t.equal(
      data.devDependencies && Object.keys(data.devDependencies).length, 1, 'devDependency entries'
    )
    t.ok(data.dependencies['client-request'], 'dependency entry')
    t.equal(
      data.dependencies['client-request'].version
      , expectedJson.dependencies['client-request'].version
      , 'dependency entry version'
    )
    t.equal(
      data.dependencies['client-request'].from
      , expectedJson.dependencies['client-request'].from
      , 'dependency entry from'
    )
    t.ok(!data.dependencies['client-request'].dependencies, 'empty dependencies declaration excluded')
    t.ok(!data.dependencies['client-request'].devDependencies, 'devDependencies declaration excluded')

    // top level devDependency tape
    var depTape = data.devDependencies['tape']
    var expectedTape = expectedJson.devDependencies['tape']

    t.ok(depTape, 'tape is a devDependencies')
    t.equal(depTape.version, expectedTape.version, 'tape version')
    t.equal(depTape.from, expectedTape.from, 'tape from')
    t.ok(depTape.dependencies, 'tape has dependencies')
    t.ok(!depTape.devDependencies, 'tape data does not have devDependencies')
    t.ok(!depTape.optionalDependencies, 'tape data does not have optionalDependencies')
    t.ok(!depTape.peerDependencies, 'tape data does not have peerDependencies')

    // tape dependency, through
    t.ok(depTape.dependencies.through, 'tape has through as a dependency')
    t.equal(
      depTape.dependencies.through.version
      , expectedTape.dependencies.through.version
      , 'through version'
    )

    t.end()
  })
})
