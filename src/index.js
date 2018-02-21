const axios = require('axios')
const fs = require('fs')
const path = require('path')

const precheck = require('./prechecks').default
const verify = require('./prechecks').verify
const getLatestCodeURL = require('./utils/urls').getLatestCodeURL
const download = require('./download').default

const CH_PATH = '/home/za/coding_projects/personal/chromium-updater/chromium'
const LATEST_VERSION_URL = require('./utils/urls').LATEST_VERSION_URL
console.log('\033[2J', new Date().getHours(), ':', new Date().getMinutes())

precheck(CH_PATH, LATEST_VERSION_URL)
  .then(({ installedVersions, latestVersion }) =>
    verify(installedVersions, latestVersion),
  )
  .then(updateInfo => {
    if (updateInfo.backlogged !== 0) {
      console.log('Updating')
      const LATEST_CODE_URL = getLatestCodeURL(updateInfo.latestVersion)
      download(LATEST_CODE_URL)
    } else {
      throw new Error('You have the latest version')
    }
  })
  .catch(err => console.log(err))
