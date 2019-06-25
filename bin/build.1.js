const { execSync } = require('child_process')

const oDir = process.argv[2]
const wDir = process.argv[2] + '-tmp'

execSync('cp -r ' + oDir + ' ' + wDir)

let opts = { cwd: wDir }

execSync('electron-icon-maker --input=icon.png --output=icons', opts)
execSync('mv icons/icons/mac/icon.icns icon.icns', opts)
execSync('yarn init -y', opts)
execSync('yarn add electron@3.1.1 --dev', opts)
execSync('electron-packager . Midst\\ Beta --overwrite --platform=darwin --arch=x64 --icon=icon.icns', opts)
execSync('mkdir ../releases/midst', opts)
execSync('cp -r ./Midst\\ Beta-darwin-x64 ../releases/midst/Midst\\ Beta-darwin-x64_' + + new Date(), opts)

setTimeout(() => {
  execSync('rm -rf ' + wDir)
}, 500)
