const https = require('https')
const logUpdate = require('log-update')
const AdmZip = require('adm-zip')
const fs = require('fs')

const unzip = downloadedInfo => {
  const zipFile = new AdmZip(downloadedInfo.downloadedZipPath)
  const zipEntries = zipFile.getEntries()

  zipFile.extractAllTo(
    `${downloadedInfo.directory}/${downloadedInfo.latestVersion}`,
    true,
  )
}

exports.default = verifiedInfo => {
  const downloadedZipPath = `${verifiedInfo.directory}/${
    verifiedInfo.latestVersion
  }.zip`

  let downloaderZip = fs.createWriteStream(downloadedZipPath)

  https
    .get(verifiedInfo.codeURL, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      let downloadCounter = 0
      const downloadFrames = ['----', ' ---', '- --', '-- -', '--- ']

      if (statusCode !== 200) {
        throw new Error(`Request failed due to response code ${statusCode}`)
      } else if (!/^application\/zip/.test(contentType)) {
        throw new Error(`Expected a zip file, but recieved ${contentType}`)
      }

      res.pipe(downloaderZip)

      res.on('data', () => {
        const downloadFrame =
          downloadFrames[
            (downloadCounter = ++downloadCounter % downloadFrames.length)
          ]
        logUpdate(`Downloading ${downloadFrame}`)
      })

      res.on('end', () => {
        logUpdate(`Downloading complete`)
        unzip({ downloadedZipPath, ...verifiedInfo })
      })
    })
    .on('error', err => {
      console.error(err)
    })
}
