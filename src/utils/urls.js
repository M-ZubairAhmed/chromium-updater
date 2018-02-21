exports.LATEST_VERSION_URL =
  'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2FLAST_CHANGE?alt=media'

exports.getLatestCodeURL = LatestVersion =>
  `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${LatestVersion}%2Fchrome-linux.zip?alt=media`
