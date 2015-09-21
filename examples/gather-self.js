// gather dependency info about gather-dependencies

var fs = require('fs')
var util = require('util')
var path = require('path')
var gatherDependencies = require('..')

var filename = 'gather-dependencies-report.json'
var fqp = path.resolve(__dirname, filename)

gatherDependencies(path.resolve(__dirname, '..'), function cb (err, data) {
  if (err) return console.error(err)

  console.log('Gathered dependencies:')
  console.log(util.inspect(data, { showHidden: true, depth: null, colors: true }))

  fs.writeFile(fqp, JSON.stringify(data, null, 2), function cb (err) {
    if (err) return console.error(err.message)

    console.log('Wrote file: %s', fqp)
  })
})
