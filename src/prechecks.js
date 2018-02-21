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

exports.verify = (installedVersions, latestVersion) => {
  if (installedVersions.includes(`${latestVersion}`)) {
    return { latestVersion, backlogged: 0 }
  } else {
    const backlogged = latestVersion - Math.max(...installedVersions)
    return { latestVersion, backlogged }
  }
}

exports.default = (versionsDirectory, latestVersionURL) =>
  Promise.all([
    getInsalledVersionsList(versionsDirectory),
    getLatestVersion(latestVersionURL),
  ]).then(values => ({
    installedVersions: values[0],
    latestVersion: values[1],
  }))
