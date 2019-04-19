const { execSync } = require('child_process')
const plist = require('./plist')
const { existsSync, lstatSync, readFileSync, writeFileSync } = require('fs')

const srcDir = 'src'
const tmpDir = 'tmp'
const distDir = 'dist'
const buildTmpDir = tmpDir + '/Midst-darwin-x64'
const buildDistDir = distDir + '/Midst-darwin-x64_' + + new Date()
const builtApp = buildDistDir + '/Midst.app'
const plistFile = buildDistDir + '/Midst.app/Contents/Info.plist'

const dirtyFiles = [
  'node_modules',
  'tmp',
  'package.json',
  'yarn.lock',
  tmpDir,
  distDir,
]

let opts = { cwd: tmpDir }

function cleanup(leaveDist) {
  for (const file of dirtyFiles) {
    if (existsSync(file)) {
      if (lstatSync(file).isDirectory()) {
        if (
          !leaveDist
          || (leaveDist && file !== distDir)
        ) {
          execSync('rm -rf ' + file)
        }
      }

      else {
        execSync('rm -rf ' + file)
      }
    }
  }
}

cleanup()
execSync('cp -r ' + srcDir + ' ' + tmpDir)
execSync('electron-icon-maker --input=icon.png --output=icons', opts)
execSync('mv icons/icons/mac/icon.icns icon.icns', opts)
execSync('yarn init -y', opts)
execSync('yarn add electron@3.1.1 --dev')
execSync('electron-packager ../tmp Midst --overwrite --platform=darwin --arch=x64 --icon=icon.icns', opts)
execSync('mkdir ' + distDir)
execSync('cp -r ' + buildTmpDir + ' ' + buildDistDir)

const plistRawData = readFileSync(plistFile, { encoding: 'utf8' })
const plistParsedData = plist.parse(plistRawData)

const newPlistData = Object.assign({}, plistParsedData, {
  CFBundleDocumentTypes: [{
    CFBundleTypeExtensions: ['midst'],
    CFBundleTypeIconFile: 'electron.icns',
    CFBundleTypeName: 'public.midst',
    CFBundleTypeRole: 'Editor',
    LSHandlerRank: 'Alternate',
    LSItemContentTypes: ['public.midst']
  }],
  UTImportedTypeDeclarations: [{
    UTTypeConformsTo: ['public.data'],
    UTTypeIdentifier: 'public.midst',
    UTTypeTagSpecification: {
      'com.apple.ostype': 'TXT',
      'public.filename-extension': ['midst'],
      'public.mime-type': 'application/txt'
    }
  }]
})

const newPlistBuiltData = plist.build(newPlistData)

writeFileSync(plistFile, newPlistBuiltData)

try {
  execSync('create-dmg ' + builtApp + ' ' + distDir)
}

catch(err) {
  console.log(err)
}

cleanup(true)
