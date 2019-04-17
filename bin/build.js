const { execSync } = require('child_process')
const { plist } = require('plist')
const { readFileSync } = require('fs')

const timestamp = + new Date()
const oDir = process.argv[2]
const wDir = process.argv[2] + '-tmp'

execSync('cp -r ' + oDir + ' ' + wDir)

let opts = { cwd: wDir }

execSync('electron-icon-maker --input=icon.png --output=icons', opts)
execSync('mv icons/icons/mac/icon.icns icon.icns', opts)
execSync('yarn init -y', opts)
execSync('yarn add electron@3.1.1 --dev', opts)
execSync('electron-packager . Midst --overwrite --platform=darwin --arch=x64 --icon=icon.icns', opts)
execSync('mkdir ../releases/midst', opts)
execSync('cp -r ./Midst-darwin-x64 ../releases/midst/Midst-darwin-x64_' + timestamp, opts)

setTimeout(() => {
  // const appPlistData = readFileSync('../releases/midst/Midst-darwin-x64_' + timestamp + '/Contents')

  execSync('rm -rf ' + wDir)
}, 500)
