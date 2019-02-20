const Quill = require('./quill/quill/quill')

/**
 * Midst
 */
class Midst extends React.Component {
// ================================================================================
// Default Props
// ================================================================================
  static get defaultProps() {
    return {
      fileData: { data: window.testFileData },
    }
  }

  constructor(props) {
    super(props)

// ================================================================================
// Initial State
// ================================================================================
    this.initialState = {
      playbackUid: + new Date(),
      author: 'Anonymous',
      creatingDraftMarker: false,
      cursors: [],
      drawerOpen: false,
      editingDraftMarker: null,
      fileAbsPath: false,
      focusMode: false,
      hasUnsavedChanges: false,
      index: 0,
      markers: [],
      replayMode: false,
      replayModeOpenedFromDrawer: false,
      responsiveScrolling: true,
      showDraftMarkerLabels: true,
      showDraftMarkers: true,
      stack: [],
      title: 'Untitled',
      displayTitle: 'Untitled',
      highestEverDraftNumber: 0,
      pickerIsOpen: false,
      playing: false,
      playbackSpeed: 1,
      playbackSpeedDropOpen: false,
    }

    this.state = JSON.parse(JSON.stringify(this.initialState))

// ================================================================================
// Bound Methods
// ================================================================================
    this.cancelExitFocusModeIntent = this.cancelExitFocusModeIntent.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.createDraftMarker = this.createDraftMarker.bind(this)
    this.deleteDraftMarker = this.deleteDraftMarker.bind(this)
    this.draftMarkerLabelOnKeyDown = this.draftMarkerLabelOnKeyDown.bind(this)
    this.editDraftMarkerLabel = this.editDraftMarkerLabel.bind(this)
    this.exitFocusModeIntent = this.exitFocusModeIntent.bind(this)
    this.newFile = this.newFile.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.openFile = this.openFile.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
    this.quit = this.quit.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.saveFileAs = this.saveFileAs.bind(this)
    this.sliderOnChange = this.sliderOnChange.bind(this)
    this.toggleDrawerOpen = this.toggleDrawerOpen.bind(this)
    this.toggleFocusMode = this.toggleFocusMode.bind(this)
    this.toggleReplayMode = this.toggleReplayMode.bind(this)

// ================================================================================
// Class Properties
// ================================================================================
    this.exitFocusModeIntentTimer = null
    this.quill = null
    this.FILE_EXT = '.midst'
    this.EXIT_FOCUS_MODE_HOVER_TIME_LIMIT = 500
    this.DRAFT_MARKER_REPLAY_MODE_PREVIEW_TIME = 1000
    this.FONTS = ['Helvetica', 'Courier', 'Georgia', 'Tahoma', 'Times New Roman', 'Arial', 'Verdana', 'Garamond', 'Lato']
    this.FONT_IDS = this.FONTS.map(name => name.toLowerCase().replace(/ /g, '-'))
    this.FONT_FAMILY_STYLE_TPL = name => `
      #quill-toolbar .ql-font span[data-label='${name}']::before {
        font-family: '${name}';
      }

      .ql-font-${this.FONT_IDS[this.FONTS.indexOf(name)]} {
        font-family: '${name}';
      }
    `
    this.FONT_SIZES = ['9px', '10px', '11px', false, '13px', '14px', '18px', '24px', '36px', '48px', '64px', '72px', '96px', '144px', '288px']
    this.FONT_SIZE_STYLE_TPL = name => `
      .ql-size-${name} {
        font-size: ${name};
      }
    `
  }

// ================================================================================
// Lifecycle
// ================================================================================
  componentDidMount() {
    document.body.addEventListener('keydown', evt => {
      const { playing, index, stack } = this.state

      if (window.MIDST_IS_PLAYER) {
        switch (evt.keyCode) {
          case 32:
            if (this.state.playing) {
              this.pause()
            }

            else {
              this.play()
            }
            break
          case 37:
            if (!playing && index > 0) {
              this.setPos(index - 1)
            }
            break
          case 39:
            if (!playing && index < stack.length - 1) {
              this.setPos(index + 1)
            }
            break
        }
      }
    })

    document.getElementById('editor').addEventListener('keydown', evt => {
      if ((evt.key === 'z' || evt.key === 'Z') && evt.metaKey) {
        evt.stopImmediatePropagation()
      }
    })

    document.getElementById('editor').addEventListener('click', evt => {
      if (this.state.creatingDraftMarker) {
        this.exitReplayMode()
        this.setState({
          editingDraftMarker: null,
          creatingDraftMarker: false,
        })
      }
    })

    this.setUpQuill()

    if (typeof ipc !== 'undefined') {
      ipc.on('fileOpened', (evt, fileData) => this.load(fileData))
      ipc.on('menu.newFile', this.newFile)
      ipc.on('menu.openFile', this.openFile)
      ipc.on('menu.quit', this.quit)
      ipc.on('menu.responsiveScrollingOff', () => this.setState({ responsiveScrolling: false }))
      ipc.on('menu.responsiveScrollingOn', () => this.setState({ responsiveScrolling: true }))
      ipc.on('menu.saveFile', this.saveFile)
      ipc.on('menu.saveFileAs', this.saveFileAs)
      ipc.on('menu.stepBack', this.step(-1))
      ipc.on('menu.stepForward', this.step(1))
    }

    document.body.addEventListener('keydown', this.onKeyDown)

    if (this.props.fileData && window.MIDST_IS_PLAYER) {
      this.load(this.props.fileData)
    }
  }

// ================================================================================
// Handlers
// ================================================================================
  sliderOnChange(val) {
    const index = Math.ceil(this.state.stack.length * val)
    this.setPos(index)
  }

  onKeyDown(evt) {
    const { index, stack, focusMode, replayMode, creatingDraftMarker, editingDraftMarker } = this.state
    switch (evt.keyCode) {
      case 27:
        if (focusMode) {
          evt.stopPropagation()
          this.exitFocusMode()
        }

        else if (creatingDraftMarker) {
          evt.stopPropagation()
          this.exitReplayMode()
          this.setState({
            creatingDraftMarker: false,
            editingDraftMarker: null,
          })
        }

        else if (replayMode) {
          evt.stopPropagation()
          this.exitReplayMode()
        }

        break
      case 37:
        if (replayMode && index > 0 && !editingDraftMarker && !creatingDraftMarker) {
          evt.stopPropagation()
          this.setPos(index - 1)
        }
        break
      case 39:
        if (replayMode && index < stack.length && !editingDraftMarker && !creatingDraftMarker) {
          evt.stopPropagation()
          this.setPos(index + 1)
        }
        break
    }
  }

  openDrawer() {
    this.setState({ drawerOpen: true, replayModeOpenedFromDrawer: !this.state.replayMode })
    this.enterReplayMode()
  }

  closeDrawer() {
    if (this.state.replayModeOpenedFromDrawer) {
      this.exitReplayMode()
    }
    this.setState({ drawerOpen: false, replayModeOpenedFromDrawer: false })
  }

  toggleDrawerOpen() {
    if (this.state.drawerOpen) {
      this.closeDrawer()
    }

    else {
      this.openDrawer()
    }
  }

// ================================================================================
// Methods
// ================================================================================
  setPos(index, cb) {
    this.setState({ index }, cb && cb())
    const sliceIndex = index === this.state.stack.length ? this.state.stack.length - 1 : index
    this.quill.setContents(this.state.stack[sliceIndex].content)
    if (this.state.responsiveScrolling) {
      this.focusQuillAtCursor()
    }
  }

  async checkForUnsavedChanges(message) {
    if (this.state.hasUnsavedChanges) {
      const res = await remote.getGlobal('confirm')(
        message || 'The current document contains unsaved changes. Proceed anyway?',
        ['Ok', 'Cancel'],
      )

      if (res === 1) return false
    }

    return true
  }

  async openFile() {
    if (!await this.checkForUnsavedChanges()) return
    remote.getGlobal('openFile')()
  }

  async newFile() {
    if (!await this.checkForUnsavedChanges()) return
    this.setState(this.initialState)
    this.quill.setContents([])
  }

  async quit() {
    if (!await this.checkForUnsavedChanges()) return
    remote.getGlobal('quit')()
  }

  midstFileModel() {
    const { stack, markers, highestEverDraftNumber, author, displayTitle, cursors } = this.state
    return  { stack, meta: { markers, highestEverDraftNumber, author, displayTitle, cursors }}
  }

  async saveFile () {
    const { fileAbsPath, hasUnsavedChanges } = this.state

    if (!hasUnsavedChanges) return

    if (!fileAbsPath) {
      this.saveFileAs()
    }

    else {
      remote.getGlobal('saveFile')(fileAbsPath, this.midstFileModel())
      this.setState({hasUnsavedChanges: false})
    }
  }

  async saveFileAs () {
    const fileInfo = await remote.getGlobal('saveFileAs')(this.midstFileModel())

    if (!fileInfo) return

    this.setState({
      fileAbsPath: fileInfo.fileAbsPath,
      title: fileInfo.fileName.replace(new RegExp(`${this.FILE_EXT}$`), ''),
      hasUnsavedChanges: false
    })
  }

  load(fileData) {
    this.setState({
      title: fileData.fileName ? fileData.fileName.replace(this.FILE_EXT, '') : 'Untitled',
      index: fileData.data.stack.length,
      stack: fileData.data.stack,
      author: fileData.data.meta.author,
      displayTitle: fileData.data.meta.displayTitle,
      markers: fileData.data.meta.markers,
      cursors: fileData.data.meta.cursors || [],
      highestEverDraftNumber: fileData.data.meta.highestEverDraftNumber || 0,
      hasUnsavedChanges: false,
      fileAbsPath: fileData.path,
    }, () => {
      this.quill.setContents(_.get(_.last(this.state.stack), 'content'))
    })
  }

  enterReplayMode() {
    this.setState({
      replayMode: true,
      editingDraftMarker: null,
    })
    // this.setPos(this.state.stack.length - 1)
    // setTimeout(() => {
    //   this.focusQuillAtEnd()
    // }, 250)
  }

  exitReplayMode() {
    if (this.state.creatingDraftMarker) return

    this.setState({
      replayMode: false,
      drawerOpen: false,
    })

    // this.setPos(this.state.stack.length - 1)
  }

  toggleReplayMode() {
    const { replayMode, creatingDraftMarker, stack } = this.state

    if (stack.length < 1) return

    if (replayMode && !creatingDraftMarker) {
      this.exitReplayMode()
    }

    else {
      this.enterReplayMode()
    }
  }

  enterFocusMode() {
    this.setState({ focusMode: true })
    if (this.state.replayMode) {
      this.exitReplayMode()
    }
  }

  exitFocusMode() {
    this.setState({ focusMode: false })
    this.focusQuillAtEnd()
  }

  toggleFocusMode() {
    const { focusMode } = this.state
    if (focusMode) {
      this.exitFocusMode()
    }

    else {
      this.enterFocusMode()
    }
  }

  focusQuillAtEnd() {
    const length = this.quill.getLength()
    this.quill.focus()
    this.quill.setSelection(length, 1)
  }

  focusQuillAtCursor() {
    const cursorPos = this.state.cursors[this.state.index] || 0
    this.quill.setSelection(cursorPos, 0)
  }

  editDraftMarkerLabel(timelineIndex, inDrawer) {
    return () => {
      const id = 'draft-marker-' + timelineIndex + (inDrawer ? '-in-drawer' : '')
      const marker = _.find(this.state.markers, { index: timelineIndex })

      this.setState({ editingDraftMarker: timelineIndex + (inDrawer ? '-drawer' : '') })

      setTimeout(() => {
        document.getElementById(id).value = marker.name || marker.defaultName
        document.getElementById(id).focus()
        document.getElementById(id).select()
        this.quill.disable()
      })

      document.getElementById(id).addEventListener('blur', (evt) => {
        this.saveDraftMarkerLabel(timelineIndex, inDrawer)
      })
    }
  }

  draftMarkerLabelOnKeyDown(timelineIndex) {
    return (evt) => {
      evt.stopPropagation()
      if (evt.keyCode === 13) {
        setTimeout(() => {
          this.saveDraftMarkerLabel(timelineIndex)
        })
      }
    }
  }

  saveDraftMarkerLabel(timelineIndex, inDrawer) {
    const { markers, creatingDraftMarker } = this.state
    const id = 'draft-marker-' + timelineIndex + (inDrawer ? '-in-drawer' : '')
    const inputValue = document.getElementById(id).value
    const marker = _.find(markers, { index: timelineIndex })

    if (inputValue === '') {
      marker.name = marker.defaultName
    }

    else {
      marker.name = inputValue
    }

    this.setState({
      markers,
      editingDraftMarker: null,
      creatingDraftMarker: false,
    })

    this.quill.enable()

    if (creatingDraftMarker) {
      this.exitReplayMode()
    }
  }

  setUpQuill() {
    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#quill-toolbar',
      },
      formats: ['bold', 'italic', 'underline', 'align', 'size', 'font', 'background'],
    })

    this.quill.enable(!window.MIDST_IS_PLAYER)

    const Font = Quill.import('formats/font')
    Font.whitelist = [false].concat(_.tail(this.FONT_IDS))
    Quill.register(Font, true)

    const fontFamilyStylesInjected = document.createElement('style')
    fontFamilyStylesInjected.innerText = _.reduce(this.FONTS, (styleDec, style) => styleDec + this.FONT_FAMILY_STYLE_TPL(style), '')
    document.head.appendChild(fontFamilyStylesInjected)

    var Size = Quill.import('attributors/style/size')
    Size.whitelist = this.FONT_SIZES
    Quill.register(Size, true)

    const fontSizeStylesInjected = document.createElement('style')
    fontSizeStylesInjected.innerText = _.reduce(this.FONT_SIZES, (styleDec, style) => styleDec + this.FONT_SIZE_STYLE_TPL(style), '')
    document.head.appendChild(fontSizeStylesInjected)

    this.quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return

      const selection = this.quill.getSelection()
      const nextCursor = selection ? selection.index : _.last(cursors)

      this.setState({
        index: this.state.stack.length,
        stack: this.state.stack.concat([{ content: this.quill.getContents(), time: + new Date() }]),
        cursors: this.state.cursors.concat([nextCursor]),
        hasUnsavedChanges: true,
        replayMode: false,
        drawerOpen: false,
        creatingDraftMarker: false,
        editingDraftMarker: null,
      })
    })

    const pickers = document.querySelectorAll('.ql-picker')
    for (const picker of pickers) {
      picker.addEventListener('mousedown', () => {
        this.setState({ pickerIsOpen: !this.state.pickerIsOpen })
      })
    }
  }

  exitFocusModeIntent() {
    if (!this.state.focusMode) return

    this.cancelExitFocusModeIntent()
    this.exitFocusModeIntentTimer = window.setTimeout(() => {
      this.exitFocusMode()
    }, parseInt(this.EXIT_FOCUS_MODE_HOVER_TIME_LIMIT, 10))
  }

  cancelExitFocusModeIntent() {
    window.clearTimeout(this.exitFocusModeIntentTimer)
  }

  step(dir) {
    return () => {
      const {index, stack, replayMode} = this.state

      if (
        dir === -1 && index > 0
        || dir === 1 && index < stack.length
      ) {
        this.goTo(index + dir)

        if (!replayMode) {
          this.toggleReplayMode()
        }
      }
    }
  }

  goTo(index) {
    this.setState({ index }, () => {
      if (index === this.state.stack.length) {
        index = index - 1
      }
      this.quill.setContents(this.state.stack[index].content)
      this.focusQuillAtEnd()
    })
  }

  draftMarkerModel(realIndex) {
    const defaultName = 'Draft ' + (this.state.highestEverDraftNumber + 1)
    return {
      index: realIndex,
      defaultName,
      name: defaultName,
    }
  }

  createDraftMarker() {
    const { markers, index, replayMode, highestEverDraftNumber, stack } = this.state
    const markerIndices = markers.map(marker => marker.index)
    const realIndex = index === stack.length ? index - 1 : index + 1

    if (markerIndices.indexOf(realIndex) >= 0) return

    this.setState({
      hasUnsavedChanges: true,
      creatingDraftMarker: true,
      highestEverDraftNumber: highestEverDraftNumber + 1,
      markers: markers.concat([this.draftMarkerModel(realIndex)]),
    }, () => {
      this.editDraftMarkerLabel(realIndex)()
    })

    if (!replayMode) {
      this.enterReplayMode()
    }
  }

  markerIndexFromTimelineIndex(timelineIndex) {
    const { markers } = this.state
    return markers.findIndex(({index}) => index === timelineIndex)
  }

  deleteDraftMarker(timelineIndex) {
    const { markers, drawerOpen } = this.state
    const markerIndex = this.markerIndexFromTimelineIndex(timelineIndex)
    markers.splice(markerIndex, 1)
    this.setState({ markers })
    if (drawerOpen && markers.length < 1) {
      this.exitReplayMode()
    }
  }

  applyFormat(formatName) {
    return () => {
      switch (formatName) {
        case 'align-left':
          this.quill.format('align', null, 'user')
          break
        case 'align-center':
          this.quill.format('align', 'center', 'user')
          break
        case 'align-right':
          this.quill.format('align', 'right', 'user')
          break
        case 'align-justify':
          this.quill.format('align', 'justify', 'user')
          break
      }
    }
  }

// ================================================================================
// Render Helepers
// ================================================================================
  quillToolbarSize() {
    return e('select', {
      className: 'ql-size',
      defaultValue: 'def',
    },
      this.FONT_SIZES.map((name, i) => (
        name === false ? e('option', {key: i, value: 'def'}, '12')
        : e('option', {key: i, value: this.FONT_SIZES[i]}, name.replace('px', ''))
      ))
    )
  }

  quillToolbarFont() {
    return e('select', {
      className: 'ql-font',
      defaultValue: 'def',
    },
      this.FONTS.map((name, i) => (
        i === 0 ? e('option', {key: i, value: 'def'}, 'Helvetica')
        : e('option', {key: i, value: this.FONT_IDS[i]}, name)
      ))
    )
  }

  quillToolbarStyle() {
    return e(React.Fragment, {},
      e('button', {className: 'ql-bold'}),
      e('button', {className: 'ql-italic'}),
      e('button', {className: 'ql-underline'}),
    )
  }

  quillToolbarAlign() {
    return e(React.Fragment, {},
      e('button', {
        className: 'align-left',
        onClick: this.applyFormat('align-left')
      },
        e('img', {
          className: 'temp-align-icon',
          src: 'align-left.png',
        })
      ),
      e('button', {
        className: 'align-center',
        onClick: this.applyFormat('align-center')
      },
        e('img', {
          className: 'temp-align-icon',
          src: 'align-center.png',
        }),
      ),
      e('button', {
        className: 'align-right',
        onClick: this.applyFormat('align-right')
      },
        e('img', {
          className: 'temp-align-icon',
          src: 'align-right.png',
        })
      ),
      e('button', {
        className: 'align-justify',
        onClick: this.applyFormat('align-justify')
      },
        e('img', {
          className: 'temp-align-icon',
          src: 'align-justify.png',
        })
      ),
    )
  }

  quillToolbarFormats(children) {
    return e('span', {
      className: 'ql-formats',
    },
      children,
    )
  }

  quillToolbar() {
    return e('div', {
      id: 'quill-toolbar',
    },
      this.quillToolbarFormats(this.quillToolbarSize()),
      this.quillToolbarFormats(this.quillToolbarFont()),
      this.quillToolbarFormats(this.quillToolbarStyle()),
      this.quillToolbarFormats(this.quillToolbarAlign()),
    )
  }

  midstToolbarLeft() {
    const { hasUnsavedChanges, stack, replayMode, markers, index, creatingDraftMarker } = this.state
    const markerIndices = markers.map(marker => marker.index)

    return e('div', { className: 'midst-toolbar midst-toolbar--left' },
      e('button', { className: 'logo' },
        e('img', { src: 'm.png' }),
      ),
      e('button', {
        onClick: (evt) => console.log(evt) // this.openFile,
      }, e(Folder)),
      e('button', {
        className: !hasUnsavedChanges ? 'deactivated' : '',
        onClick: this.saveFile,
      }, e(Save)),
    )
  }

  midstToolbarRight() {
    const { stack, replayMode, markers, index, creatingDraftMarker } = this.state
    const markerIndices = markers.map(marker => marker.index)

    return e('div', { className: 'midst-toolbar midst-toolbar--right' },
      e('button', {
        onClick: this.toggleFocusMode,
      }, e(Eye)),
      e('button', {
        className: 'draft-marker' +
          (markerIndices.indexOf(index) >= 0 && !creatingDraftMarker ? ' deactivated' : '') +
          (creatingDraftMarker ? ' highlighted' : ''),
        onMouseDown: !creatingDraftMarker ? this.createDraftMarker : null,
      }, e(Flag)),
      e('button', {
        className:
          'replay-button'
          + (stack.length < 1 ? ' deactivated' : '')
          + (replayMode && !creatingDraftMarker ? ' highlighted' : '')
        ,
        onClick: this.toggleReplayMode,
      }, e(Rewind)),
      e('button', {
        className: (markers.length < 1 ? ' deactivated' : ''),
        onClick: markers.length ? this.toggleDrawerOpen : null,
      }, e(List)),
    )
  }

  slider() {
    const { replayMode, index, stack, creatingDraftMarker, showDraftMarkers, drawerOpen } = this.state
    const value = index === stack.length - 1 ? 1 : index / stack.length

    return e('div', {
      className: 'midst-slider'
        + (replayMode ? ' up' : '')
        + (drawerOpen ? ' with-drawer' : ''),
    },
      e(Slider, {
        id: 'midst-slider',
        hideCursor: false,
        controlled: true,
        readOnly: creatingDraftMarker,
        value,
        onChange: this.sliderOnChange,
        onMouseDown: this.pause,
      }),
      showDraftMarkers || window.MIDST_IS_PLAYER ? this.draftMarkers() : null,
    )
  }

  draftMarkers() {
    const { markers, stack, editingDraftMarker, showDraftMarkerLabels, index: currentTimelinePosition } = this.state
    return e('div', {
      className: 'draft-markers'
    },
      markers.map(({index, name}, markerNo) => {
        const active = currentTimelinePosition === index
        return e('div', {
          key: index,
          className: 'draft-marker'
            + (editingDraftMarker === index ? ' editing' : '')
            + (active ? ' active' : '')
          ,
          style: {
            left: (index / stack.length * 100) + '%',
          },
          onClick: () => this.goTo(index),
        },
          showDraftMarkerLabels ? this.draftMarkerLabel(name || 'Draft ' + (markerNo + 1), index, false, active) : null,
        )
      })
    )
  }

  draftMarkerLabel(name, timelineIndex, inDrawer, active) {
    return e('div', {
      className: 'draft-marker-label' + (this.state.editingDraftMarker === timelineIndex + (inDrawer ? '-drawer' : '') ? ' editing' : ''),
      onClick: active || inDrawer ? (evt) => evt.stopPropagation() : null
    },
      e('span', {
        onClick: active || inDrawer ? this.editDraftMarkerLabel(timelineIndex, inDrawer) : null,
      }, name),
      e('input', {
        id: 'draft-marker-' + timelineIndex + (inDrawer ? '-in-drawer' : ''),
        onKeyDown: this.draftMarkerLabelOnKeyDown(timelineIndex),
      }),
    )
  }

  drawer() {
    const { drawerOpen, markers, showDraftMarkers, showDraftMarkerLabels } = this.state
    const reversedMarkers = [].concat(markers).reverse()

    return e('div', {
      className: 'drawer' + (drawerOpen ? ' open' : '')
    },
      ...reversedMarkers.map(({name, index}) =>
        e('div', {
          className: 'marker-list-item',
          onClick: () => this.goTo(index)
        },
          this.draftMarkerLabel(name, index, true),
          e('span', {
            className: 'marker-list-item-delete',
            onClick: () => this.deleteDraftMarker(index),
          }, 'delete')
        ),
      ),
      e('div', { className: 'marker-list-controls' },
        e('div', {
          className: 'marker-list-control',
          onClick: () => this.setState({ showDraftMarkerLabels: !showDraftMarkerLabels })
        }, (showDraftMarkerLabels ? 'Hide' : 'Show') + ' Draft Marker Labels'),
        e('div', {
          className: 'marker-list-control',
          onClick: () => this.setState({ showDraftMarkers: !showDraftMarkers })
        }, (showDraftMarkers ? 'Hide' : 'Show') + ' Draft Markers'),
      )
    )
  }

  playerControls() {
    const { playing, playbackSpeed, playbackSpeedDropOpen } = this.state
    return e('div', { className: 'player-controls' },
      !playing ? e('div', {
        className: 'player-control play-button',
        onClick: this.play,
      }, e(Play)) : null,
      playing ? e('div', {
        className: 'player-control pause-button',
        onClick: this.pause,
      }, e(Pause)) : null,
      e('div', {
        className: 'player-control speed-selector',
      },
        e(Drop, {
          direction: 'up',
          label: playbackSpeed + 'x',
          controlled: true,
          open: playbackSpeedDropOpen,
          onDropToggled: () => this.setState({ playbackSpeedDropOpen: true }),
        },
          e('div', { onClick: () => this.setState({ playbackSpeedDropOpen: false, playbackSpeed: 0.25 }) }, '.25x'),
          e('div', { onClick: () => this.setState({ playbackSpeedDropOpen: false, playbackSpeed: 0.5 }) }, '.5x'),
          e('div', { onClick: () => this.setState({ playbackSpeedDropOpen: false, playbackSpeed: 1 }) }, '1x'),
          e('div', { onClick: () => this.setState({ playbackSpeedDropOpen: false, playbackSpeed: 2 }) }, '2x'),
          e('div', { onClick: () => this.setState({ playbackSpeedDropOpen: false, playbackSpeed: 4 }) }, '4x'),
        ),
      ),
      e('div', {
        className: 'player-control volume-slider',
      }, e(Volume2)),
      e('div', {
        className: 'player-control settings-button',
      }, e(Settings)),
    )
  }

  play() {
    if (this.state.index === this.state.stack.length) {
      this.setPos(0)
    }

    this.setState({ playing: true }, this.autoScrub)
  }

  pause() {
    this.setState({ playing: false })
  }

  autoScrub() {
    const { playing, playbackSpeed, index, stack } = this.state

    if (!playing) return
    if (index === undefined || index > stack.length - 2) {
      this.setState({ playing: false })
      return
    }

    const advanceBy = playbackSpeed >= 1 ? playbackSpeed * 2 : 1
    const timeout = playbackSpeed < 1 ? (1 / playbackSpeed) * 50 : 1

    setTimeout(() => {
      this.setPos(index + advanceBy)
      this.autoScrub()
    }, timeout)
  }

// ================================================================================
// Render
// ================================================================================
  render() {
    const { focusMode, title, drawerOpen, pickerIsOpen, replayMode } = this.state

    return (
      e('div', {
        className: 'midst'
          + (focusMode ? ' focus-mode' : '')
          + (window.MIDST_IS_PLAYER ? ' player' : ''),
      },
        !window.MIDST_IS_PLAYER ? e('div', {
          className: 'title-bar',
        }, title) : null,
        e('div', {
          className: 'toolbars',
          onMouseEnter: this.exitFocusModeIntent,
          onMouseLeave: this.cancelExitFocusModeIntent,
        },
          !window.MIDST_IS_PLAYER ? e('div', { className: 'toolbars-fade' },
            this.midstToolbarLeft(),
            this.quillToolbar(),
            this.midstToolbarRight(),
          ) : e('div', { id: 'quill-toolbar' }),
        ),
        e('div', { className: 'main' + (drawerOpen ? ' drawer-open' : '') },
          pickerIsOpen ? e('div', {
            className: 'picker-panic-guard',
            onClick: (e) => {
              this.setState({ pickerIsOpen: false })
            }
          }) : null,
          e('div', { className: 'editor-wrapper' + (replayMode ? ' with-app-timeline' : '') },
            e('div', {
              id: 'editor',
            })
          ),
          this.slider(),
          window.MIDST_IS_PLAYER ? this.playerControls() : null,
        ),
        this.drawer(),
      )
    )
  }
}

// ================================================================================
// Export
// ================================================================================
window.Midst = Midst