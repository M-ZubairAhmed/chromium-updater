const axios = require('axios')
const fs = require('fs')
const path = require('path')

const precheck = require('./precheck').default
const verify = require('./verify').default

const LATEST_UPDATE_URL = require('./utils/urls').LATEST_UPDATE_URL
const CH_PATH = '/home/za/coding_projects/personal/chromium-updater/chromium'

precheck(CH_PATH, LATEST_UPDATE_URL)
  .then(({ installedVersions, latestVersion }) =>
    verify(installedVersions, latestVersion),
  )
  .then(shouldUpdate => console.log(shouldUpdate))
