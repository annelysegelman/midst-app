// ================================================================================
// Imports
// ================================================================================
const { basename } = require('path')
const { watch, writeFileSync, readFileSync } = require('fs')
const { app, BrowserWindow, dialog, Menu } = require('electron')

// ================================================================================
// Windows
// ================================================================================
let mainWindow

// ================================================================================
// Config
// ================================================================================
const FILE_EXT = 'midst'

// ================================================================================
// Globals
// ================================================================================
global['quit'] = () => {
  app.quit()
}

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
      mainWindow,
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

global['openFile'] = () => {
  dialog.showOpenDialog({properties: ['openFile'], filters: [{name: FILE_EXT, extensions: [FILE_EXT]}]}, (filePaths) => {
    if (filePaths) {
      app.addRecentDocument(filePaths[0])
      const fileName = basename(filePaths[0])
      let data

      try {
        data = JSON.parse(readFileSync(filePaths[0], 'utf8'))
      }

      catch (err) {
        console.log(err)
        data = false
      }

      mainWindow.webContents.send('fileOpened', {fileName, data, path: filePaths[0]})
    }
  })
}

// ================================================================================
// Bootstrap
// ================================================================================
const bootstrap = (menuItems, cb) => {
  app.on('ready', () => {
    const { size: { height: size }} = require('electron').screen.getPrimaryDisplay()

    mainWindow = new BrowserWindow({
      x: 20,
      y: 70,
      width: size - 20,
      height: size - 100,
      resizable: true,
      transparent: true,
      titleBarStyle: 'hidden',
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`)

    if (process.env.NODE_ENV === 'development') {
      mainWindow.toggleDevTools()
      watch(__dirname, {recursive: true}, () => {
        mainWindow.webContents.reloadIgnoringCache()
      })
    }

    if (menuItems) {
      Menu.setApplicationMenu(
        Menu.buildFromTemplate(menuItems(mainWindow))
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
const menu = (mainWindow) => {
  const appMenu = {
    label: 'App',
    submenu: [
      {label: 'About App', click: () => {}},
      {type: 'separator'},
      {role: 'services'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {label: 'Quit', accelerator: 'Cmd+Q', click: () => mainWindow.webContents.send('menu.quit')},
    ]
  }

  const fileMenu = {
    label: 'File',
    submenu: [
      {label: 'New', accelerator: 'Cmd+N', click: () => mainWindow.webContents.send('menu.newFile')},
      {type: 'separator'},
      {label: 'Open...', accelerator: 'Cmd+O', click: () => mainWindow.webContents.send('menu.openFile')},
      {type: 'separator'},
      {label: 'Save', accelerator: 'Cmd+S', click: () => mainWindow.webContents.send('menu.saveFile')},
      {label: 'Save As...', accelerator: 'Shift+Cmd+S', click: () => mainWindow.webContents.send('menu.saveFileAs')},
    ],
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      { label: 'Step Back', accelerator: 'Cmd+Z', click: () => mainWindow.webContents.send('menu.undo')},
      { label: 'Step Forward', accelerator: 'Shift+Cmd+Z', click: () => mainWindow.webContents.send('menu.redo')},
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
      { label: 'Increase Font Size', accelerator: 'Command+Plus', click: () => mainWindow.webContents.send('menu.fontSizeUp')},
      { label: 'Decrease Font Size', accelerator: 'Command+-', click: () => mainWindow.webContents.send('menu.fontSizeDown')},
      { label: 'Default Font Size', accelerator: 'Command+0', click: () => mainWindow.webContents.send('menu.fontSizeDefault')},
      { type: 'separator' },
        { label: 'Bold', click: () => mainWindow.webContents.send('menu.toggleFontFormatBold')},
        { label: 'Italic', click: () => mainWindow.webContents.send('menu.toggleFontFormatItalid')},
      { type: 'separator' },
      { label: 'Font Size', submenu: [
        { label: '10', click: () => mainWindow.webContents.send('menu.setFontSize', 10)},
        { label: '12', click: () => mainWindow.webContents.send('menu.setFontSize', 12)},
        { label: '14', click: () => mainWindow.webContents.send('menu.setFontSize', 14)},
        { label: '24', click: () => mainWindow.webContents.send('menu.setFontSize', 24)},
        { label: '36', click: () => mainWindow.webContents.send('menu.setFontSize', 36)},
      ]},
      { type: 'separator' },
      { label: 'Font Family', submenu: [
        { label: 'Helvetica', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Helvetica')},
        { label: 'Courier', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Courier')},
        { label: 'Times New Roman', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Times New Roman')},
        { label: 'Arial', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Arial')},
        { label: 'Garamond', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Garamond')},
        { label: 'Lato', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Lato')},
      ]},
    ]
  }

  // const viewMenu = {
  //   label: 'View',
  //   submenu: [
  //     { label: 'Activate Cursor Following', click: () => mainWindow.webContents.send('menu.responsiveScrollingOn')},
  //     { label: 'Deactivate Responsive Scrolling', click: () => mainWindow.webContents.send('menu.responsiveScrollingOff')},
  //   ]
  // }

  return [
    appMenu,
    fileMenu,
    editMenu,
    fontMenu,
    // viewMenu,
  ]
}

// ================================================================================
// Go
// ================================================================================
bootstrap(menu)
