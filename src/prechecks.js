const axios = require('axios')
const fs = require('fs')

const getLatestVersion = async url => {
  try {
    const response = await axios.get(url)
    const version = await response.data
    return version
  } catch (err) {
    throw err
  }
}

const getInsalledVersionsList = dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, items) => {
      resolve(items)
    })
  })

exports.verify = checkedInfo => {
  if (checkedInfo.installedVersions.includes(`${checkedInfo.latestVersion}`)) {
    return { backlogged: 0, ...checkedInfo }
  } else {
    const backlogged =
      checkedInfo.latestVersion - Math.max(...checkedInfo.installedVersions)
    return { backlogged, ...checkedInfo }
  }
}

exports.default = (versionsDirectory, latestVersionURL) =>
  Promise.all([
    getInsalledVersionsList(versionsDirectory),
    getLatestVersion(latestVersionURL),
  ]).then(values => ({
    installedVersions: values[0],
    latestVersion: values[1],
    directory: versionsDirectory,
  }))
