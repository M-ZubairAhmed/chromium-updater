exports.default = (installedVersions, latestVersion) => {
  if (installedVersions.includes(`${latestVersion}`)) {
    console.log('you have latest version')
    return false
  } else {
    const backlogged = latestVersion - Math.max(...installedVersions)
    console.log(
      'Latest version is',
      latestVersion,
      'You are outdated by',
      backlogged,
      'version',
    )
    return true
  }
}
