const https = require('https')
const fs = require('fs')

const getLatestVersion = url =>
  new Promise((resolve, reject) => {
    let data = ''
    https
      .get(url, res => {
        if (res.statusCode !== 200) {
          reject(`Request failed due to response code ${statusCode}`)
        }
        res.on('data', chuck => {
          data += chuck
        })
        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', err => {
        reject(err)
      })
  })

const getInsalledVersionsList = dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, items) => {
      if (err) {
        reject(err)
      }
      resolve(items)
    })
  })

exports.verify = checkedInfo => {
  let backlogged
  const filterInstalledVersions = checkedInfo.installedVersions.filter(
    item => !item.includes('.zip'),
  )
  if (filterInstalledVersions.includes(`${checkedInfo.latestVersion}`)) {
    backlogged = 0
  } else {
    backlogged =
      checkedInfo.latestVersion - Math.max(...filterInstalledVersions)
  }
  return Object.assign({}, { backlogged }, checkedInfo, {
    installedVersions: filterInstalledVersions,
  })
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
