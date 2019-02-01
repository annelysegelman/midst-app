/**
 * Midst
 */
class Midst extends React.Component {
// ================================================================================
// Default Props
// ================================================================================
  static get defaultProps() {
    return {}
  }

  constructor(props) {
    super(props)

// ================================================================================
// Initial State
// ================================================================================
    this.initialState = {
      creatingDraftMarker: false,
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
      highestEverDraftNumber: 0,
      pickerIsOpen: false,
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
    this.FILE_EXT = 'mst'
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

    document.body.addEventListener('keydown', this.onKeyDown)

    // setTimeout(() => {
    //   this.load({"data":{"meta":{"markers":[{"index":67,"name":"asdfasdfasdf"},{"index":85,"name":null}]},"stack":[{"content":{"ops":[{"insert":"a\n"}]},"time":1546722744011},{"content":{"ops":[{"insert":"as\n"}]},"time":1546722744122},{"content":{"ops":[{"insert":"asd\n"}]},"time":1546722744126},{"content":{"ops":[{"insert":"asdf\n"}]},"time":1546722744252},{"content":{"ops":[{"insert":"asdfa\n"}]},"time":1546722744336},{"content":{"ops":[{"insert":"asdfad\n"}]},"time":1546722744452},{"content":{"ops":[{"insert":"asdfad \n"}]},"time":1546722744493},{"content":{"ops":[{"insert":"asdfad a\n"}]},"time":1546722744644},{"content":{"ops":[{"insert":"asdfad as\n"}]},"time":1546722744712},{"content":{"ops":[{"insert":"asdfad asd\n"}]},"time":1546722744731},{"content":{"ops":[{"insert":"asdfad asdf\n"}]},"time":1546722744828},{"content":{"ops":[{"insert":"asdfad asdf \n"}]},"time":1546722744912},{"content":{"ops":[{"insert":"asdfad asdf a\n"}]},"time":1546722744952},{"content":{"ops":[{"insert":"asdfad asdf as\n"}]},"time":1546722745061},{"content":{"ops":[{"insert":"asdfad asdf asd\n"}]},"time":1546722745089},{"content":{"ops":[{"insert":"asdfad asdf asdf\n"}]},"time":1546722745185},{"content":{"ops":[{"insert":"asdfad asdf asdf \n"}]},"time":1546722745272},{"content":{"ops":[{"insert":"asdfad asdf asdf a\n"}]},"time":1546722745316},{"content":{"ops":[{"insert":"asdfad asdf asdf as\n"}]},"time":1546722745433},{"content":{"ops":[{"insert":"asdfad asdf asdf asd\n"}]},"time":1546722745440},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf\n"}]},"time":1546722745569},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf \n"}]},"time":1546722745604},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf a\n"}]},"time":1546722745684},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf as\n"}]},"time":1546722745773},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asd\n"}]},"time":1546722745785},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf\n"}]},"time":1546722745871},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf \n"}]},"time":1546722745960},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf a\n"}]},"time":1546722746012},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf as\n"}]},"time":1546722746094},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asd\n"}]},"time":1546722746128},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf\n"}]},"time":1546722746197},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf \n"}]},"time":1546722746256},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf a\n"}]},"time":1546722746353},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf as\n"}]},"time":1546722746428},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asd\n"}]},"time":1546722746437},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf\n"}]},"time":1546722746541},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf \n"}]},"time":1546722746613},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf a\n"}]},"time":1546722746653},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf as\n"}]},"time":1546722746760},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asd\n"}]},"time":1546722746768},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf\n"}]},"time":1546722746885},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf \n"}]},"time":1546722746960},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf a\n"}]},"time":1546722747020},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf ad\n"}]},"time":1546722747147},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf ads\n"}]},"time":1546722747152},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf\n"}]},"time":1546722747213},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf \n"}]},"time":1546722747325},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf a\n"}]},"time":1546722747377},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf ad\n"}]},"time":1546722747509},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf ads\n"}]},"time":1546722747516},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf adsf\n"}]},"time":1546722747609},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf adsf \n"}]},"time":1546722747741},{"content":{"ops":[{"insert":"a\n"}]},"time":1546722755538},{"content":{"ops":[{"insert":"as\n"}]},"time":1546722755637},{"content":{"ops":[{"insert":"asd\n"}]},"time":1546722755668},{"content":{"ops":[{"insert":"asdf\n"}]},"time":1546722755817},{"content":{"ops":[{"insert":"asdfa\n"}]},"time":1546722755827},{"content":{"ops":[{"insert":"asdfas\n"}]},"time":1546722755918},{"content":{"ops":[{"insert":"asdfasd\n"}]},"time":1546722755952},{"content":{"ops":[{"insert":"asdfasdf\n"}]},"time":1546722756014},{"content":{"ops":[{"insert":"asdfasdfa\n"}]},"time":1546722756106},{"content":{"ops":[{"insert":"asdfasdfas\n"}]},"time":1546722756185},{"content":{"ops":[{"insert":"asdfasdfasd\n"}]},"time":1546722756208},{"content":{"ops":[{"insert":"asdfasdfasd \n"}]},"time":1546722756321},{"content":{"ops":[{"insert":"asdfasdfasd M\n"}]},"time":1546722756934},{"content":{"ops":[{"insert":"asdfasdfasd MA\n"}]},"time":1546722756974},{"content":{"ops":[{"insert":"asdfasdfasd MAR\n"}]},"time":1546722757130},{"content":{"ops":[{"insert":"asdfasdfasd MARK\n"}]},"time":1546722757282},{"content":{"ops":[{"insert":"asdfasdfasd MARK \n"}]},"time":1546722759004},{"content":{"ops":[{"insert":"asdfasdfasd MARK a\n"}]},"time":1546722759112},{"content":{"ops":[{"insert":"asdfasdfasd MARK as\n"}]},"time":1546722759205},{"content":{"ops":[{"insert":"asdfasdfasd MARK asd\n"}]},"time":1546722759248},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdf\n"}]},"time":1546722759327},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfa\n"}]},"time":1546722759384},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfas\n"}]},"time":1546722759477},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasd\n"}]},"time":1546722759494},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdf\n"}]},"time":1546722759562},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfa\n"}]},"time":1546722759710},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfas\n"}]},"time":1546722759738},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasd\n"}]},"time":1546722759753},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf\n"}]},"time":1546722759853},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf \n"}]},"time":1546722759964},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf M\n"}]},"time":1546722760572},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MA\n"}]},"time":1546722760609},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MAR\n"}]},"time":1546722760770},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK\n"}]},"time":1546722761005},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK \n"}]},"time":1546722763257},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK a\n"}]},"time":1546722763556},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK as\n"}]},"time":1546722763651},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asd\n"}]},"time":1546722763700},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdf\n"}]},"time":1546722763817},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfa\n"}]},"time":1546722763862},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfas\n"}]},"time":1546722763962},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasd\n"}]},"time":1546722763988},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdf\n"}]},"time":1546722764041},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfa\n"}]},"time":1546722764149},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfas\n"}]},"time":1546722764228},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasd\n"}]},"time":1546722764284},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdf\n"}]},"time":1546722764376},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdfa\n"}]},"time":1546741544539},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdfas\n"}]},"time":1546741544659}]},"fileName":"Untitled.midst","path":"/Users/tony/Desktop/Untitled.midst"})
    // }, 250)
  }

  componentDidUpdate() {
    // console.log(this.state.editingDraftMarker)
  }

// ================================================================================
// Handlers
// ================================================================================
  sliderOnChange(val) {
    const index = Math.ceil(this.state.stack.length * val)
    this.setPos(index, this.state.responsiveScrolling)
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
  setPos(index, focusQuillAtEnd = true) {
    this.setState({ index })
    const sliceIndex = index === this.state.stack.length ? this.state.stack.length - 1 : index
    this.quill.setContents(this.state.stack[sliceIndex].content)
    if (focusQuillAtEnd) {
      this.focusQuillAtEnd()
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
    const { stack, markers, highestEverDraftNumber } = this.state
    return  { stack, meta: { markers, highestEverDraftNumber }}
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
      title: fileInfo.fileName.replace(new RegExp(`.${this.FILE_EXT}$`), ''),
      hasUnsavedChanges: false
    })
  }

  load(fileData) {
    this.setState({
      title: fileData.fileName.replace(this.FILE_EXT, ''),
      index: fileData.data.length,
      stack: fileData.data.stack,
      markers: fileData.data.meta.markers,
      highestEverDraftNumber: fileData.data.meta.highestEverDraftNumber,
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
    this.setPos(this.state.stack.length - 1)
    this.focusQuillAtEnd()
  }

  exitReplayMode() {
    if (this.state.creatingDraftMarker) return

    this.setState({
      replayMode: false,
      drawerOpen: false,
    })

    this.setPos(this.state.stack.length - 1)
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

      const stack = _.cloneDeep(this.state.stack)
      const index = stack.length - 1
      stack.push({ content: this.quill.getContents(), time: + new Date() })
      this.setState({
        index,
        stack,
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
    const { markers, index, replayMode, highestEverDraftNumber } = this.state
    const markerIndices = markers.map(marker => marker.index)
    const realIndex = index + 1

    if (markerIndices.indexOf(realIndex) >= 0) return

    this.setState({
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
        onClick: this.openFile,
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
    const { replayMode, index, stack, creatingDraftMarker, showDraftMarkers } = this.state
    if (replayMode) {
      const value = index / stack.length

      return e('div', {
        className: 'midst-slider',
      },
        e(Slider, {
          id: 'midst-slider',
          hideCursor: false,
          controlled: true,
          readOnly: creatingDraftMarker,
          value,
          onChange: this.sliderOnChange,
        }),
        showDraftMarkers ? this.draftMarkers() : null,
      )
    }
  }

  draftMarkers() {
    const { markers, stack, editingDraftMarker, showDraftMarkerLabels, index: currentTimelinePosition } = this.state
    return e('div', {
      className: 'draft-markers'
    },
      markers.map(({index, name}, markerNo) => {
        return e('div', {
          key: index,
          className: 'draft-marker'
            + (editingDraftMarker === index ? ' editing' : '')
            + (currentTimelinePosition === index ? ' active' : '')
          ,
          style: {
            left: (index / stack.length * 100) + '%',
          },
          onClick: () => this.goTo(index),
        },
          showDraftMarkerLabels ? this.draftMarkerLabel(name || 'Draft ' + (markerNo + 1), index) : null,
        )
      })
    )
  }

  draftMarkerLabel(name, timelineIndex, inDrawer) {

    inDrawer && console.log(name)

    return e('div', {
      className: 'draft-marker-label' + (this.state.editingDraftMarker === timelineIndex + (inDrawer ? '-drawer' : '') ? ' editing' : ''),
      onClick: (evt) => evt.stopPropagation()
    },
      e('span', {
        onClick: this.editDraftMarkerLabel(timelineIndex, inDrawer),
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

// ================================================================================
// Render
// ================================================================================
  render() {
    const { focusMode, title, drawerOpen, pickerIsOpen } = this.state

    return (
      e('div', {
        className: 'midst' + (focusMode ? ' focus-mode' : ''),
      },
        e('div', {
          className: 'title-bar',
        }, title),
        e('div', {
          className: 'toolbars',
          onMouseEnter: this.exitFocusModeIntent,
          onMouseLeave: this.cancelExitFocusModeIntent,
        },
          e('div', { className: 'toolbars-fade' },
            this.midstToolbarLeft(),
            this.quillToolbar(),
            this.midstToolbarRight(),
          ),
        ),
        e('div', { className: 'main' + (drawerOpen ? ' drawer-open' : '') },
          pickerIsOpen ?
            e('div', {
              className: 'picker-guard',
              onClick: (e) => {
                e.stopPropagation()
                this.setState({ pickerIsOpen: false })
              },
            })
            : null,
          e('div', { id: 'editor' }),
          this.slider(),
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