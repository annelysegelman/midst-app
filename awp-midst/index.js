// ================================================================================
// Imports
// ================================================================================
const { basename, join } = require('path')
const moment = require('moment')
const { execSync } = require('child_process')
const { watch, writeFileSync, readFileSync, readdirSync } = require('fs')
const { app, BrowserWindow, dialog, Menu } = require('electron')

// ================================================================================
// Window
// ================================================================================
let mainWindow

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
let openPathWhenReady = null
let okToCloseWindow = false

async function openFileHelper(path, isAutosave = false) {
  if (!isAutosave) {
    app.addRecentDocument(path)
  }

  const fileName = basename(path)

  let data

  try {
    const macPath = path.replace(/ /g, '\\ ')
    const workingPath = __dirname + '/working-uncompressed'
    execSync(`rm -f ${workingPath}`)
    execSync(`rm -f ${workingPath}.gz`)
    execSync(`cp ${macPath} ${workingPath}.gz`)
    execSync(`gunzip ${workingPath}.gz`)
    data = JSON.parse(readFileSync(workingPath, 'utf8'))

    // Use this line to open an old, uncompressed .midst file
    // data = JSON.parse(readFileSync(path, 'utf8'))
  }

  catch (err) {
    dialog.showMessageBox({ message: err.stderr.toString() })
    console.log(err)
    data = false
  }

  mainWindow.webContents.send('fileOpened', { fileName, data, path, isAutosave })
}

global['saveFile'] = async (fileAbsPath, fileData) => {
  writeFileSync(fileAbsPath, JSON.stringify(fileData))
  const macPath = fileAbsPath.replace(/ /g, '\\ ')
  execSync(`gzip ${macPath}`)
  execSync(`mv ${macPath + '.gz'} ${macPath}`)
}

global['saveFileAs'] = (fileData) => {
  return new Promise((resolve) => {
    dialog.showSaveDialog(
      mainWindow,
      {filters: [{name: 'Midst Files', extensions: ['midst']}]},
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

global['openFile'] = () => {
  dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'midst', extensions: ['midst']}]}, (filePaths) => {
    if (filePaths) {
      openFileHelper(filePaths[0])
    }
  })
}

global['setOkToCloseWindow'] = (val) => {
  okToCloseWindow = val
}

// ================================================================================
// Autosave
// ================================================================================
const autosaveBlankPath = join(__dirname, 'midst-autosave.blank.midst')
const autosaveWorkingPath = join(__dirname, 'midst-autosave.working.midst')
const autosaveCurrentPath = join(__dirname, 'midst-autosave.dated.' + + new Date() + '.midst')

function extractTimestamp(fileName) {
  const timestamp = fileName
    .replace('midst-autosave.dated.', '')
    .replace('.midst', '')
  return parseInt(timestamp, 10)
}

function cleanAutosaves() {
  const files = readdirSync(__dirname).filter((file) => {
    return /^midst-autosave\.dated\./.test(file)
  })

  files.sort((a, b) => {
    a = extractTimestamp(a)
    b = extractTimestamp(b)
    return b - a
  })

  const oldFiles = files.slice(5)

  filesCheck = files.map((file) => {
    return moment(extractTimestamp(file)).format('MM DD YYYY mm:ss')
  })

  for (let i = 0; i < oldFiles.length; i++) {
    execSync(`rm -f ${__dirname}/${oldFiles[i]}`)
  }
}

function initAutosave() {
  execSync(`cp ${autosaveWorkingPath} ${autosaveCurrentPath}`)
  execSync(`cp ${autosaveBlankPath} ${autosaveWorkingPath}`)
  cleanAutosaves()
}

global['saveAutosave'] = (data) => {
  writeFileSync(autosaveWorkingPath, JSON.stringify(data))
}

global['openAutosave'] = () => {
  openFileHelper(autosaveCurrentPath, true)
}

// ================================================================================
// Bootstrap
// ================================================================================
const bootstrap = (menuItems, cb) => {
  const {systemPreferences} = require('electron')
  systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
  systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)

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

    mainWindow.setMinimumSize(500, 500)

    mainWindow.on('close', (evt) => {
      if (!okToCloseWindow) {
        evt.preventDefault()
        mainWindow.webContents.send('menu.quit')
      }
    })

    mainWindow.on('closed', () => app.quit())

    initAutosave()

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

    if (openPathWhenReady) {
      setTimeout(function() {
        openFileHelper(openPathWhenReady)
      }, 1000)
    }

    if (cb) {
      cb()
    }
  })

  app.on('open-file', (evt, path) => {
    if (app.isReady()) {
      openFileHelper(path)
    }

    else {
      openPathWhenReady = path
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
      {label: 'About Midst', click: () => mainWindow.webContents.send('menu.about')},
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
      {type: 'separator'},
      {label: 'Restore Previous Session', click: () => mainWindow.webContents.send('menu.openAutosave')},
    ],
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
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
      { label: 'Bold', click: () => mainWindow.webContents.send('menu.toggleFontFormatBold')},
      { label: 'Italic', click: () => mainWindow.webContents.send('menu.toggleFontFormatItalic')},
      { label: 'Font Family', submenu: [
        { label: 'Bell', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Bell')},
        { label: 'Courier', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Courier')},
        { label: 'Garamond', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Garamond')},
        { label: 'Helvetica', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Helvetica')},
        { label: 'Lato', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Lato')},
        { label: 'Times New Roman', click: () => mainWindow.webContents.send('menu.setFontFamily', 'Times New Roman')},
      ]},
    ]
  }

  const viewMenu = {
    label: 'Options',
    submenu: [
      { label: 'Focus Mode', click: () => mainWindow.webContents.send('menu.toggleFocusMode')},
      { label: 'Cursor Following', click: () => mainWindow.webContents.send('menu.editorToggleCursorFollowing')},
      { type: 'separator' },
      { label: 'Increase Zoom', accelerator: 'Command+L', click: () => {
        mainWindow.webContents.send('menu.fontSizeUp')
      }},
      { label: 'Decrease Zoom', accelerator: 'Command+-', click: () => mainWindow.webContents.send('menu.fontSizeDown')},
      { label: 'Default Zoom', accelerator: 'Command+M', click: () => mainWindow.webContents.send('menu.fontSizeDefault')},
      { type: 'separator' },
      { label: 'Zoom Level', submenu: [
        { label: 'Tiny', click: () => mainWindow.webContents.send('menu.setFontSize', 10)},
        { label: 'Small', click: () => mainWindow.webContents.send('menu.setFontSize', 12)},
        { label: 'Medium', click: () => mainWindow.webContents.send('menu.setFontSize', 14)},
        { label: 'Large', click: () => mainWindow.webContents.send('menu.setFontSize', 24)},
        { label: 'Extra Large', click: () => mainWindow.webContents.send('menu.setFontSize', 36)},
      ]}
    ],
  }

  return [
    appMenu,
    fileMenu,
    editMenu,
    fontMenu,
    viewMenu,
  ]
}

// ================================================================================
// Go
// ================================================================================
bootstrap(menu)
