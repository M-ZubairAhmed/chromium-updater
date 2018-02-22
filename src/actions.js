const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')
const getLatestCodeURL = require('./utils').getLatestCodeURL

exports.unzip = downloadedInfo => {
  const zipFile = new AdmZip(downloadedInfo.downloadedZipPath)
  const zipEntries = zipFile.getEntries()

  zipFile.extractAllTo(
    `${downloadedInfo.directory}/${downloadedInfo.latestVersion}`,
    true,
  )
}

exports.download = verifiedInfo =>
  new Promise((resolve, reject) => {
    const LATEST_CODE_URL = getLatestCodeURL(verifiedInfo.latestVersion)
    const downloadedZipPath = `${verifiedInfo.directory}/${
      verifiedInfo.latestVersion
    }.zip`

    let downloaderZip = fs.createWriteStream(downloadedZipPath)
    https
      .get(LATEST_CODE_URL, res => {
        if (res.statusCode !== 200) {
          reject(`Request failed due to response code ${statusCode}`)
        } else if (!/^application\/zip/.test(res.headers['content-type'])) {
          reject(`Expected a zip file, but recieved ${contentType}`)
        }
        res.pipe(downloaderZip)
        res.on('end', () => {
          resolve(
            Object.assign(
              {},
              verifiedInfo,
              { downloadedZipPath },
              { latestVersionURL: LATEST_CODE_URL },
            ),
          )
        })
      })
      .on('error', err => reject(err))
  })
