/*!
 * gather-dependencies
 * Copyright(c) 2015 NodeSource, Inc.
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')
var extend = require('util')._extend
var logger = console
var readPackageTree = require('read-package-tree')

/**
 * Configuration
 */

var defaultOptions = {
  maxDepth: Infinity,
  meta: true
}

// dependency types evaluated by application/module
var topLevelNpmDependencyTypes = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

// dependency types relevant after top levl
var depthNpmDependencyTypes = [
  'dependencies',
  'optionalDependencies'
]

/*
 * Exports
 */
module.exports = gatherDependencies

/**
 * gatherDependencies
 * @param  {string}   root     Base directory where dependencies are gathered
 * @param  {object}   options  Options
 * @param  {function} callback callback
 */
function gatherDependencies (root, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = extend(defaultOptions, options)

  /**
   * read-package-tree callback
   * @param  {error}  err  read-package-tree error
   * @param  {object} data read-package-tree blob (contains cyclical refrences)
   */
  var rpt_cb = function rpt_cb (err, data) {
    if (err) return logger.error(err)
    if (data.error) return logger.error(data.error)
    if (!data.package) {
      logger.warn('`data.package` not defined. Initializing placeholder.')
      data.package = {}
    }

    var dependencyReport = {}

    if (!data.package || !data.package.name) logger.warn('`data.package.name` missing')
    dependencyReport.name = data.package.name

    if (!data.package || !data.package.version) logger.warn('`data.package.version` missing')
    dependencyReport.version = data.package.version

    if (options.meta) {
      dependencyReport.meta = {
        nodeVersions: process.versions,
        date: Date.now()
      }
    }

    buildDependencyReport(dependencyReport, data, options, 0)

    // Finally, return gatherDependencies callback
    callback(null, dependencyReport)
  }

  fs.stat(path.resolve(root, 'node_modules'), function (err, stats) {
    if (err && err.code === 'ENOENT') {
      fs.stat(path.resolve(root, 'package.json'), function (er, sta) {
        if (er && er.code === 'ENOENT') {
          return callback(new Error('No module found'))
        }
        return callback(new Error('Need to run \`npm install\` first.'))
      })
    }
  })

  readPackageTree(root, options.filter, rpt_cb)
}

/**
 * Build dependency report
 * @param  {object} report report object being operated on
 * @param  {object} data   npm dependency tree data
 * @param  {object} options
 * @param  {number} depth  Depth to evaluate. 0 is top level only.
 * @return {object}        Completed report object.
 */

var buildDependencyReport = function buildDependencyReport (report, data, options, depth) {
  if (!report) report = {}
  if (!data) data = {}
  if (!options) options = {}
  if (!depth) depth = 0

  var lookup = {}
  var npmDependencyTypes = depth ? depthNpmDependencyTypes : topLevelNpmDependencyTypes

  // build list of all dependencies
  npmDependencyTypes.forEach(function types (type) {
    if (data.package[type] && Object.keys(data.package[type]).length) {
      report[type] = data.package[type]

      // remap versions as objects instead of a string
      Object.keys(report[type]).forEach(function dep (name) {
        // build lookup to reference back to build off of
        lookup[name] = type
        report[type][name] = { requestedVersion: report[type][name] }
      })
    }
  })

  data.children.forEach(function childDeps (depData) {
    if (!lookup[depData.package.name]) return // not a relevant dependency (probably devDep)

    var entry = report[lookup[depData.package.name]][depData.package.name]
    entry.version = depData.package.version
    entry.from = depData.package._from

    buildDependencyReport(entry, depData, options, depth + 1)
  })

  return report
}
