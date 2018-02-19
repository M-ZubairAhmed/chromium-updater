const axios = require('axios')
const LATEST_UPDATE_URL = require('./utils/urls').LATEST_UPDATE_URL

const latestVersion = async () => {
  try {
    response = await axios.get(LATEST_UPDATE_URL)
    version = response.data
    return await version
  } catch (error) {
    throw error
  }
}

console.log('Checking for latest version of Chromium')
latestVersion()
  .then(result => console.log(result))
  .catch(err => console.log(err))
