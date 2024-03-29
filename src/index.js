// ================================================================================
// Imports
// ================================================================================
const { basename } = require('path')
const { watch, writeFileSync, readFileSync } = require('fs')
const { app, BrowserWindow, dialog, Menu } = require('electron')
const { find } = require('./lodash')

// ================================================================================
// Globals
// ================================================================================
const FILE_EXT = 'midst'

let filePathToLoadOnReady

global['confirm'] = (message, buttons) => {
  return new Promise((resolve) => {
    dialog.showMessageBox({
      title: 'Warning',
      message,
      buttons,
    },

    res => {
      resolve(res)
    })
  })
}

// ================================================================================
// File Handling
// ================================================================================
global['saveFileAs'] = (fileData) => {
  return new Promise((resolve) => {
    dialog.showSaveDialog(
      BrowserWindow.getFocusedWindow(),
      {filters: [{name: 'Midst Files', extensions: [FILE_EXT]}]},
      fileAbsPath => {
        if (fileAbsPath) {
          writeFileSync(fileAbsPath, JSON.stringify(fileData))
          resolve({fileAbsPath, fileName: basename(fileAbsPath)})
        }

        else {
          resolve(false)
        }
      },
    )
  }).then()
}

global['saveFile'] = (fileAbsPath, fileData) => {
  writeFileSync(fileAbsPath, JSON.stringify(fileData))
}

global['openFile'] = (windowIsPristine) => {
  openFileRequestedByPristineWindow = windowIsPristine
  dialog.showOpenDialog({properties: ['openFile'], filters: [{name: FILE_EXT, extensions: [FILE_EXT]}]}, (filePaths) => {
    if (filePaths) {
      global['openFileFromPath'](filePaths[0])
    }
  })
}

global['openFileFromPath'] = (path) => {
  openFileFromPath(path)
}

function openFileFromPath(path) {
  app.addRecentDocument(path)
  const fileName = basename(path)
  let data

  try {
    data = JSON.parse(readFileSync(path, 'utf8'))
  }

  catch (err) {
    console.log(err)
    data = false
  }

  BrowserWindow.getFocusedWindow().webContents.send('fileOpened', { fileName, data, path })
}

// ================================================================================
// Bootstrap
// ================================================================================
function createWindow(openFilePath) {
  const { size: { height: size }} = require('electron').screen.getPrimaryDisplay()
  const windows = BrowserWindow.getAllWindows()

  newWindow = new BrowserWindow({
    x: 20 * (windows.length + 1),
    y: 20 * (windows.length + 1),
    width: size - 20,
    height: size - 100,
    resizable: true,
    transparent: true,
    titleBarStyle: 'hidden',
  })

  newWindow.setMinimumSize(500, 500)

  newWindow.loadURL(`file://${__dirname}/index.html`)

  newWindow.on('close', (evt) => {
    if (!okToClose) {
      evt.preventDefault()
      evt.sender.webContents.send('menu.closeWindow')
    }

    else {
      okToClose = false
    }
  })

  if (openFilePath) {
    newWindow.webContents.send('openFileFromFileIcon', filePathToLoadOnReady)
  }

  if (process.env.NODE_ENV === 'development') {
    // newWindow.toggleDevTools()
    watch(__dirname, {recursive: true}, () => {
      newWindow.webContents.reloadIgnoringCache()
    })
  }
}

function bootstrap(menuItems, cb) {
  // const { systemPreferences } = require('electron')
  // systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
  // systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)

  app.on('open-file', (evt, path) => {
    const window = BrowserWindow.getFocusedWindow()

    if (!window) {
      createWindow(path)
    }

    BrowserWindow.getFocusedWindow().webContents.send('openFileFromFileIcon', path)
  })

  app.on('window-all-closed', (evt) => {
    evt.preventDefault()
  })

  app.on('ready', () => {
    createWindow()

    if (menuItems) {
      Menu.setApplicationMenu(
        Menu.buildFromTemplate(menuItems())
      )
    }

    if (cb) {
      cb()
    }
  })
}

// ================================================================================
// Menu
// ================================================================================
const menu = (state = {}) => {
  const appMenu = {
    label: 'App',
    submenu: [
      {label: 'About Midst Beta', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.about')},
      // {type: 'separator'},
      // {role: 'services'},
      // {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {label: 'Quit', accelerator: 'Cmd+Q', click: () => {
        const window = BrowserWindow.getFocusedWindow()

        if (window) {
          window.webContents.send('menu.closeWindowQuitSequence')
        }
      }},
    ]
  }

  const fileMenu = {
    label: 'File',
    submenu: [
      {label: 'New', accelerator: 'Cmd+N', click: createWindow},
      {type: 'separator'},
      {label: 'Open...', accelerator: 'Cmd+O', click: () => {
        if (BrowserWindow.getAllWindows().length) {
          BrowserWindow.getFocusedWindow().webContents.send('menu.openFile')
        }

        else {
          global['openFile']()
        }
      }},
      {type: 'separator'},
      {label: 'Save', accelerator: 'Cmd+S', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.saveFile')},
      {label: 'Save As...', accelerator: 'Shift+Cmd+S', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.saveFileAs')},
      {type: 'separator'},
      {role: 'close'},
    ],
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
      { type: 'separator' },
      { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
    ]
  }

  const fontMenu = {
    label: 'Font',
    submenu: [
      { label: 'Bold', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.toggleFontFormatBold')},
      { label: 'Italic', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.toggleFontFormatItalic')},
      { label: 'Font Family', submenu: [
        { label: 'Bell', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Bell')},
        { label: 'Courier', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Courier')},
        { label: 'Garamond', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Garamond')},
        { label: 'Helvetica', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Helvetica')},
        { label: 'Lato', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Lato')},
        { label: 'Times New Roman', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontFamily', 'Times New Roman')},
      ]},
    ]
  }

  const viewMenu = {
    label: 'Options',
    submenu: [
      { label: 'Focus Mode', type: 'checkbox', checked: state.focusMode, click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.toggleFocusMode')},
      { label: 'Cursor Following', type: 'checkbox', checked: state.cursorFollowing, click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.editorToggleCursorFollowing')},
      { type: 'separator' },
      { label: 'Increase Zoom', accelerator: 'Command+Plus', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.fontSizeUp')},
      { label: 'Decrease Zoom', accelerator: 'Command+-', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.fontSizeDown')},
      { label: 'Default Zoom', accelerator: 'Command+0', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.fontSizeDefault')},
      { type: 'separator' },
      { label: 'Zoom Level', submenu: [
        { label: 'Tiny', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontSize', 12)},
        { label: 'Small', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontSize', 14)},
        { label: 'Medium', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontSize', 16)},
        { label: 'Large', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontSize', 24)},
        { label: 'Extra Large', click: () => BrowserWindow.getFocusedWindow().webContents.send('menu.setFontSize', 36)},
      ]}
    ],
  }

  const windowMenu = {
    label: 'Window',
    submenu: [
      {role: 'minimize'},
      {role: 'zoom'},
    ]
  }

  return [
    appMenu,
    // fileMenu,
    // editMenu,
    // fontMenu,
    // viewMenu,
    // windowMenu,
  ]
}

// ================================================================================
// Go
// ================================================================================
bootstrap(menu)
