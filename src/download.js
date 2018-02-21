const https = require('https')
const logUpdate = require('log-update')

exports.default = url => {
  https
    .get(url, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      let downloadCounter = 0
      const downloadFrames = ['----', '=---', '-=--', '--=-', '---=']

      if (statusCode !== 200) {
        throw new Error(`Request failed due to response code ${statusCode}`)
      } else if (!/^application\/zip/.test(contentType)) {
        throw new Error(`Expected a zip file, but recieved ${contentType}`)
      }

      res.on('data', stream => {
        const downloadFrame =
          downloadFrames[
            (downloadCounter = ++downloadCounter % downloadFrames.length)
          ]
        logUpdate(`Downloading ${downloadFrame}`)
      })

      res.on('end', () => {
        try {
          console.log('Downloading completd')
        } catch (err) {
          throw new Error(`Download stopped abruptly: ${err}`)
        }
      })
    })
    .on('error', err => {
      console.error(err)
    })
}
