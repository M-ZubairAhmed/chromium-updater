#!/usr/bin/env node

const precheck = require('./src/prechecks').default
const verify = require('./src/prechecks').verify
const download = require('./src/actions').download
const unzip = require('./src/actions').unzip
const LATEST_VERSION_URL = require('./src/utils').LATEST_VERSION_URL
var program = require('commander')

program
  .version(process.env.npm_package_version)
  .description(
    'A node utility to download latest chromium package to linux x64 os',
  )
  .option(
    '-d, --dir <required>',
    'Add directory for Chromium downloads and extracts',
  )
  .parse(process.argv)

if (program.dir) {
  precheck(`${program.dir}`, LATEST_VERSION_URL)
    .then(checkedInfo => {
      console.log('Checking installed Chromium/s in', checkedInfo.directory)
      return verify(checkedInfo)
    })
    .then(verifiedInfo => {
      if (verifiedInfo.backlogged !== 0) {
        console.log(
          'Your CHROMIUM is outdated by',
          verifiedInfo.backlogged,
          'version/s',
        )
        console.log('Downloading latest version :', verifiedInfo.latestVersion)
        return download(verifiedInfo)
      } else {
        console.log('You already have latest version')
        process.exit(0)
      }
    })
    .then(downloadedInfo => {
      console.log('Unzipping downloaded file')
      unzip(downloadedInfo)
    })
    .catch(err => console.log(err))
} else {
  console.log('You need to provide a directory for chromium')
}
