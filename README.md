## Recovery branch

This branch branches off from the April 2019 builds and is for triage bugfixes/features only.

Future development is happening in the "CRA" branch.

## Install
    `yarn global add electron`
    `yarn global add electron-packager`
    `yarn global add electron-icon-maker`

## Dev
    `NODE_ENV=development electron midst`
    `NODE_ENV=development electron awp-midst`

## Build
    `node bin/build.js midst`
    `node bin/build.js awp-midst`

## Manual Build
1. Download the latest prebuilt binary from https://github.com/electron/electron/releases
1. Copy the project folder into Electron.app/Contents/Resources
1. Rename the project folder to "app".
1. Rename the index.js file to "main.js".
1. Open a terminal, cd into this app folder, and run `npm init -y`.
1. Double-click Electron, deal with some security hassles, etc.
1. <sup>\*</sup>Extra credit: In debug console enter `+ new Date()` and append this to the file name.
__TODO: Write a script for this.__
