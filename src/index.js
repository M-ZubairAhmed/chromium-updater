const precheck = require('./prechecks').default
const verify = require('./prechecks').verify
const download = require('./actions').download
const unzip = require('./actions').unzip
const LATEST_VERSION_URL = require('./utils').LATEST_VERSION_URL

precheck(__dirname, LATEST_VERSION_URL)
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
