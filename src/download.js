const https = require('https')

const displayProgress = () => {
  console.log('\033[2J')
  const progress = Math.floor(Math.random() * 2 + 1)
  if (progress % 2 === 0) {
    console.log('Downloading........')
  } else {
    console.log('Downloading..')
  }
}

exports.default = url => {
  https
    .get(url, res => {
      const { statusCode } = res
      const totalSize = parseInt(res.headers['content-length'])

      res.on('data', stream => {
        displayProgress()
      })

      res.on('end', () => {
        try {
          console.log('Download complete')
        } catch (e) {
          throw new Error(e)
        }
      })
    })
    .on('error', e => {
      console.error(e)
    })
}
