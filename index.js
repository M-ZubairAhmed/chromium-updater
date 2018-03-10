#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const AdmZip = require('adm-zip')
const program = require('commander')

program
 .version(process.env.npm_package_version)
 .description('A node utility to download latest chromium package to linux x64 os')
 .option('-d, --dir <required>', 'Add directory for Chromium downloads and extracts')
 .parse(process.argv)

if (!program.dir) {
 console.error('You need to provide a directory for chromium')
 process.exit(1)
}

const getInsalledVersionsList = dir =>
 new Promise((resolve, reject) => {
  fs.readdir(dir, (err, items) => {
   if (err) {
    reject(err)
   }
   resolve({ installedVersions: items.filter(item => !item.includes('.zip')), directory: dir })
  })
 })

const getLatestVersion = (installedVersions, latestVersionURL) =>
 new Promise((resolve, reject) => {
  let data = ''
  https
   .get(latestVersionURL, res => {
    if (res.statusCode !== 200) {
     reject(`Request failed due to response code ${statusCode}`)
    }
    res.on('data', chuck => {
     data += chuck
    })
    res.on('end', () => {
     resolve(Object.assign({}, installedVersions, { latestVersion: data }))
    })
   })
   .on('error', err => {
    reject(err)
   })
 })

const download = (latestVersion, latestCodeURL) =>
 new Promise((resolve, reject) => {
  const downloadedZipPath = `${latestVersion.directory}/${latestVersion.latestVersion}.zip`
  let downloaderZip = fs.createWriteStream(downloadedZipPath)
  https
   .get(latestCodeURL, res => {
    if (res.statusCode !== 200) {
     reject(`Request failed due to response code ${statusCode}`)
    } else if (!/^application\/zip/.test(res.headers['content-type'])) {
     reject(`Expected a zip file, but recieved ${contentType}`)
    }
    res.pipe(downloaderZip)
    res.on('end', () => {
     resolve(Object.assign({}, latestVersion, { downloadedZipPath }))
    })
   })
   .on('error', err => reject(err))
 })

const unzip = downloadedFile => {
 const zipFile = new AdmZip(downloadedFile.downloadedZipPath)
 const zipEntries = zipFile.getEntries()
 zipFile.extractAllTo(`${downloadedFile.directory}/${downloadedFile.latestVersion}`, true)
}

// Main program
getInsalledVersionsList(program.dir)
 .then(installedVersions => {
  console.log('- Looking for Chromium in :')
  console.log(installedVersions.directory)
  const latestVersionURL =
   'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2FLAST_CHANGE?alt=media'
  return getLatestVersion(installedVersions, latestVersionURL)
 })
 .then(latestVersion => {
  if (latestVersion.installedVersions.includes(`${latestVersion.latestVersion}`)) {
   console.log('! - You already have latest version i.e v', latestVersion.latestVersion)
   process.exit(0)
  }
  console.log(
   `- You have ${latestVersion.installedVersions.length} outdated version/s of Chromium installed`,
  )
  console.log('- Downloading latest version :', latestVersion.latestVersion)
  const latestCodeURL = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${
   latestVersion.latestVersion
  }%2Fchrome-linux.zip?alt=media`
  return download(latestVersion, latestCodeURL)
 })
 .then(downloadedFile => {
  console.log('- Download complete')
  console.log('- Unzipping downloaded file')
  unzip(downloadedFile)
  console.log('- Successfully installed Chromium v', downloadedFile.latestVersion)
 })
 .catch(err => console.log(err))
