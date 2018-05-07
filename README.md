<h1 align="center">Chromium Updater</h1>
<p align="center">
  <img src="https://user-images.githubusercontent.com/17708702/37238469-eca44114-244c-11e8-95d9-d2b9937f1a25.png"/>
</p>
<h4 align="center">A simple Chromium updater for Linux x64</h4>

[![npm version](https://badge.fury.io/js/chromium-updater.svg)](https://badge.fury.io/js/chromium-updater)

### Intro

A node utility to download and run the latest Linux build of Chromium.

It checks it you have the latest installed version if not then updates.

### Usage

1. Run the package
```bash
 npx chromium-updater -d "path/to/download"
```
2. Copy path to user settings

3. Run Chromium
```bash
./pathToChromiumVersion/chome-linux/chrome --user-settings-data='./path/to/settings' $* &> /dev/null &
```

### Why

As of now for Linux builds, there wasnt a simple upstream ppa or autoupdate. Thus this package.

### Inspiration

This is heavily inspired from a shell script package [chromium-latest-linux](https://github.com/scheib/chromium-latest-linux)
