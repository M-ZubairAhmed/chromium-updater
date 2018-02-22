const precheck = require('./prechecks').default
const verify = require('./prechecks').verify
const download = require('./actions').download
const unzip = require('./actions').unzip
const commands = require('commander')
const LATEST_VERSION_URL = require('./utils').LATEST_VERSION_URL

commands
  .version(process.env.npm_package_version)
  .option('-d, --dir', 'Add directory of your chromium downloads')
  .parse(process.argv)

let chromiumDirectory
if (commands.dir) {
  chromiumDirectory = commands.dir
} else {
  chromiumDirectory = __dirname
}

precheck(chromiumDirectory, LATEST_VERSION_URL)
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
