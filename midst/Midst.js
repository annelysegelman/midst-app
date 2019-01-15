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
      focusMode: false,
      replayMode: false,
      replayModeOpenedFromDrawer: false,
      title: 'Untitled',
      index: 0,
      stack: [],
      markers: [],
      hasUnsavedChanges: false,
      fileAbsPath: false,
      creatingDraftMarker: false,
      responsiveScrolling: true,
      editingDraftMarker: null,
      drawerOpen: false,
      showDraftMarkers: true,
      showDraftMarkerLabels: true,
    }

    this.state = JSON.parse(JSON.stringify(this.initialState))

// ================================================================================
// Bound Methods
// ================================================================================
    this.cancelExitFocusModeIntent = this.cancelExitFocusModeIntent.bind(this)
    this.createDraftMarker = this.createDraftMarker.bind(this)
    this.editDraftMarkerLabel = this.editDraftMarkerLabel.bind(this)
    this.deleteDraftMarker = this.deleteDraftMarker.bind(this)
    this.draftMarkerLabelOnKeyDown = this.draftMarkerLabelOnKeyDown.bind(this)
    this.exitFocusModeIntent = this.exitFocusModeIntent.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.newFile = this.newFile.bind(this)
    this.save = this.save.bind(this)
    this.saveAs = this.saveAs.bind(this)
    this.sliderOnChange = this.sliderOnChange.bind(this)
    this.toggleFocusMode = this.toggleFocusMode.bind(this)
    this.toggleDrawerOpen = this.toggleDrawerOpen.bind(this)
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
    this.setUpQuill()

    ipc.on('menu:newfile', this.newFile)
    ipc.on('menu:openfile', () => remote.getGlobal('openFile')())
    ipc.on('menu:savefile', this.save)
    ipc.on('menu:quit', () => remote.getGlobal('quit')(this.state.hasUnsavedChanges))
    ipc.on('menu:savefileas', this.saveAs)
    ipc.on('menu:step-back', this.step(-1))
    ipc.on('menu:step-forward', this.step(1))
    ipc.on('menu:responsiveScrollingOn', () => this.setState({ responsiveScrolling: true }))
    ipc.on('menu:responsiveScrollingOff', () => this.setState({ responsiveScrolling: false }))
    ipc.on('menu:openDrawer', this.openDrawer)
    ipc.on('menu:closeDrawer', this.closeDrawer)
    ipc.on('fileopened', (evt, fileData) => this.load(fileData))

    document.body.addEventListener('keydown', this.onKeyDown)

    // setTimeout(() => {
    //   this.load({"data":{"meta":{"markers":[{"index":67,"name":"asdfasdfasdf"},{"index":85,"name":null}]},"stack":[{"content":{"ops":[{"insert":"a\n"}]},"time":1546722744011},{"content":{"ops":[{"insert":"as\n"}]},"time":1546722744122},{"content":{"ops":[{"insert":"asd\n"}]},"time":1546722744126},{"content":{"ops":[{"insert":"asdf\n"}]},"time":1546722744252},{"content":{"ops":[{"insert":"asdfa\n"}]},"time":1546722744336},{"content":{"ops":[{"insert":"asdfad\n"}]},"time":1546722744452},{"content":{"ops":[{"insert":"asdfad \n"}]},"time":1546722744493},{"content":{"ops":[{"insert":"asdfad a\n"}]},"time":1546722744644},{"content":{"ops":[{"insert":"asdfad as\n"}]},"time":1546722744712},{"content":{"ops":[{"insert":"asdfad asd\n"}]},"time":1546722744731},{"content":{"ops":[{"insert":"asdfad asdf\n"}]},"time":1546722744828},{"content":{"ops":[{"insert":"asdfad asdf \n"}]},"time":1546722744912},{"content":{"ops":[{"insert":"asdfad asdf a\n"}]},"time":1546722744952},{"content":{"ops":[{"insert":"asdfad asdf as\n"}]},"time":1546722745061},{"content":{"ops":[{"insert":"asdfad asdf asd\n"}]},"time":1546722745089},{"content":{"ops":[{"insert":"asdfad asdf asdf\n"}]},"time":1546722745185},{"content":{"ops":[{"insert":"asdfad asdf asdf \n"}]},"time":1546722745272},{"content":{"ops":[{"insert":"asdfad asdf asdf a\n"}]},"time":1546722745316},{"content":{"ops":[{"insert":"asdfad asdf asdf as\n"}]},"time":1546722745433},{"content":{"ops":[{"insert":"asdfad asdf asdf asd\n"}]},"time":1546722745440},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf\n"}]},"time":1546722745569},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf \n"}]},"time":1546722745604},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf a\n"}]},"time":1546722745684},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf as\n"}]},"time":1546722745773},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asd\n"}]},"time":1546722745785},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf\n"}]},"time":1546722745871},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf \n"}]},"time":1546722745960},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf a\n"}]},"time":1546722746012},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf as\n"}]},"time":1546722746094},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asd\n"}]},"time":1546722746128},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf\n"}]},"time":1546722746197},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf \n"}]},"time":1546722746256},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf a\n"}]},"time":1546722746353},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf as\n"}]},"time":1546722746428},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asd\n"}]},"time":1546722746437},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf\n"}]},"time":1546722746541},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf \n"}]},"time":1546722746613},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf a\n"}]},"time":1546722746653},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf as\n"}]},"time":1546722746760},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asd\n"}]},"time":1546722746768},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf\n"}]},"time":1546722746885},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf \n"}]},"time":1546722746960},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf a\n"}]},"time":1546722747020},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf ad\n"}]},"time":1546722747147},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf ads\n"}]},"time":1546722747152},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf\n"}]},"time":1546722747213},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf \n"}]},"time":1546722747325},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf a\n"}]},"time":1546722747377},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf ad\n"}]},"time":1546722747509},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf ads\n"}]},"time":1546722747516},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf adsf\n"}]},"time":1546722747609},{"content":{"ops":[{"insert":"asdfad asdf asdf asdf asdf asdf asdf asdf adsf adsf \n"}]},"time":1546722747741},{"content":{"ops":[{"insert":"a\n"}]},"time":1546722755538},{"content":{"ops":[{"insert":"as\n"}]},"time":1546722755637},{"content":{"ops":[{"insert":"asd\n"}]},"time":1546722755668},{"content":{"ops":[{"insert":"asdf\n"}]},"time":1546722755817},{"content":{"ops":[{"insert":"asdfa\n"}]},"time":1546722755827},{"content":{"ops":[{"insert":"asdfas\n"}]},"time":1546722755918},{"content":{"ops":[{"insert":"asdfasd\n"}]},"time":1546722755952},{"content":{"ops":[{"insert":"asdfasdf\n"}]},"time":1546722756014},{"content":{"ops":[{"insert":"asdfasdfa\n"}]},"time":1546722756106},{"content":{"ops":[{"insert":"asdfasdfas\n"}]},"time":1546722756185},{"content":{"ops":[{"insert":"asdfasdfasd\n"}]},"time":1546722756208},{"content":{"ops":[{"insert":"asdfasdfasd \n"}]},"time":1546722756321},{"content":{"ops":[{"insert":"asdfasdfasd M\n"}]},"time":1546722756934},{"content":{"ops":[{"insert":"asdfasdfasd MA\n"}]},"time":1546722756974},{"content":{"ops":[{"insert":"asdfasdfasd MAR\n"}]},"time":1546722757130},{"content":{"ops":[{"insert":"asdfasdfasd MARK\n"}]},"time":1546722757282},{"content":{"ops":[{"insert":"asdfasdfasd MARK \n"}]},"time":1546722759004},{"content":{"ops":[{"insert":"asdfasdfasd MARK a\n"}]},"time":1546722759112},{"content":{"ops":[{"insert":"asdfasdfasd MARK as\n"}]},"time":1546722759205},{"content":{"ops":[{"insert":"asdfasdfasd MARK asd\n"}]},"time":1546722759248},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdf\n"}]},"time":1546722759327},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfa\n"}]},"time":1546722759384},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfas\n"}]},"time":1546722759477},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasd\n"}]},"time":1546722759494},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdf\n"}]},"time":1546722759562},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfa\n"}]},"time":1546722759710},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfas\n"}]},"time":1546722759738},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasd\n"}]},"time":1546722759753},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf\n"}]},"time":1546722759853},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf \n"}]},"time":1546722759964},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf M\n"}]},"time":1546722760572},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MA\n"}]},"time":1546722760609},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MAR\n"}]},"time":1546722760770},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK\n"}]},"time":1546722761005},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK \n"}]},"time":1546722763257},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK a\n"}]},"time":1546722763556},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK as\n"}]},"time":1546722763651},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asd\n"}]},"time":1546722763700},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdf\n"}]},"time":1546722763817},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfa\n"}]},"time":1546722763862},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfas\n"}]},"time":1546722763962},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasd\n"}]},"time":1546722763988},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdf\n"}]},"time":1546722764041},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfa\n"}]},"time":1546722764149},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfas\n"}]},"time":1546722764228},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasd\n"}]},"time":1546722764284},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdf\n"}]},"time":1546722764376},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdfa\n"}]},"time":1546741544539},{"content":{"ops":[{"insert":"asdfasdfasd MARK asdfasdfasdf MARK asdfasdfasdfas\n"}]},"time":1546741544659}]},"fileName":"Untitled.midst","path":"/Users/tony/Desktop/Untitled.midst"})
    // }, 250)
  }

  componentWillUnmount() {
    document.body.addEventListener('keydown', this.onKeyDown)
  }

// ================================================================================
// Handlers
// ================================================================================
  sliderOnChange(val) {
    const index = Math.ceil(this.state.stack.length * val)
    this.setPos(index, this.state.responsiveScrolling)
  }

  onKeyDown(evt) {
    const { index, stack, focusMode, replayMode, creatingDraftMarker, editingDraftMarkerLabel } = this.state
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
        if (replayMode && index > 0 && !!editingDraftMarkerLabel) {
          evt.stopPropagation()
          this.setPos(index - 1)
        }
        break
      case 39:
        if (replayMode && index < stack.length && !!editingDraftMarkerLabel) {
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

  async newFile() {
    if (this.state.hasUnsavedChanges) {
      const res = await remote.getGlobal('confirm')(
        'The current document contains unsaved changes. Start a new one anyway?',
        ['Ok', 'Cancel'],
      )

      if (res === 1) return
    }

    this.setState(this.initialState)
    this.quill.setContents([])
  }

  async save () {
    const { fileAbsPath, stack, hasUnsavedChanges, markers } = this.state

    if (!hasUnsavedChanges) return

    if (!fileAbsPath) {
      this.saveAs()
    }

    else {
      remote.getGlobal('saveFile')(fileAbsPath, { stack, meta: { markers }})
      this.setState({hasUnsavedChanges: false})
    }
  }

  async saveAs () {
    const { stack, markers } = this.state
    const fileInfo = await remote.getGlobal('saveFileAs')({ stack, meta: { markers }})

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
      hasUnsavedChanges: false,
      fileAbsPath: fileData.path,
    }, () => {
      this.quill.setContents(_.get(_.last(this.state.stack), 'content'))
    })
  }

  enterReplayMode() {
    this.setState({
      replayMode: true,
      creatingDraftMarker: false,
      editingDraftMarker: null,
    })
    this.setPos(this.state.stack.length - 1)
    this.focusQuillAtEnd()
  }

  exitReplayMode() {
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

  editDraftMarkerLabel(markerNo, inDrawer) {
    return () => {
      const id = 'draft-marker-' + markerNo + (inDrawer ? '-in-drawer' : '')
      this.setState({ editingDraftMarker: markerNo + (inDrawer ? '-drawer' : '') })
      setTimeout(() => {
        document.getElementById(id).focus()
        document.getElementById(id).select()
        this.quill.disable()
      })
      document.getElementById(id).addEventListener('blur', () => {
        this.saveDraftMarkerLabel(markerNo, inDrawer)
      })
    }
  }

  draftMarkerLabelOnKeyDown(markerNo) {
    return (evt) => {
      evt.stopPropagation()
      if (evt.keyCode === 13) {
        setTimeout(() => {
          this.saveDraftMarkerLabel(markerNo)
        })
      }
    }
  }

  saveDraftMarkerLabel(markerNo, inDrawer) {
    const { markers, creatingDraftMarker } = this.state
    const id = 'draft-marker-' + markerNo + (inDrawer ? '-in-drawer' : '')
    markers[markerNo].name = document.getElementById(id).value

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

    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#quill-toolbar',
      },
      formats: ['bold', 'italic', 'underline', 'align', 'size', 'font'],
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
        creatingDraftMarker: false,
        editingDraftMarker: null,
      })
    })
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

  createDraftMarker() {
    const { markers, index, replayMode } = this.state
    const markerIndices = markers.map(marker => marker.index)
    const realIndex = index + 1

    if (markerIndices.indexOf(realIndex) >= 0) return

    this.setState({ markers: markers.concat([{ index: realIndex, name: null }]) }, () => {
      this.editDraftMarkerLabel(this.state.markers.length - 1)()
    })

    if (!replayMode) {
      this.enterReplayMode()
      this.setState({ creatingDraftMarker: true })
    }
  }

  markerIndexFromTimelineIndex(timelineIndex) {
    const { markers } = this.state
    return markers.findIndex(({index}) => index === timelineIndex)
  }

  deleteDraftMarker(timelineIndex) {
    const { markers } = this.state
    const markerIndex = this.markerIndexFromTimelineIndex(timelineIndex)
    markers.splice(markerIndex, 1)
    this.setState({ markers })
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
      }
    }
  }

  draftMarkerName(name, markerNo) {
    return name || 'Draft ' + (markerNo + 1)
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
      }, 'L'),
      e('button', {
        className: 'align-center',
        onClick: this.applyFormat('align-center')
      }, 'C'),
      e('button', {
        className: 'align-right',
        onClick: this.applyFormat('align-right')
      }, 'R'),
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

  midstToolbar() {
    const { hasUnsavedChanges, stack, replayMode, markers, index, creatingDraftMarker } = this.state
    const markerIndices = markers.map(marker => marker.index)

    return e('div', { className: 'midst-toolbar' },
      e('button', {
        className: 'draft-marker' +
          (markerIndices.indexOf(index) >= 0 && !creatingDraftMarker ? ' deactivated' : '') +
          (creatingDraftMarker ? ' highlighted' : ''),
        onClick: this.createDraftMarker,
      }, e(Flag)),
      e('button', {
        className: !hasUnsavedChanges ? 'deactivated' : '',
        onClick: this.save,
      }, e(Save)),
      e('button', {
        onClick: () => remote.getGlobal('openFile')(),
      }, e(Folder)),
      e('button', {
        className:
          'replay-button'
          + (stack.length < 1 ? ' deactivated' : '')
          + (replayMode && !creatingDraftMarker ? ' highlighted' : '')
        ,
        onClick: this.toggleReplayMode,
      }, e(Rewind)),
      e('button', {
        onClick: this.toggleFocusMode,
      }, e(Eye)),
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
    const { markers, stack, editingDraftMarker, showDraftMarkerLabels } = this.state
    return e('div', {
      className: 'draft-markers'
    },
      markers.map(({index, name}) => {
        return e('div', {
          key: index,
          className: 'draft-marker' + (editingDraftMarker === index ? ' editing' : ''),
          style: {
            left: (index / stack.length * 100) + '%',
          },
          onClick: () => this.goTo(index),
        },
          showDraftMarkerLabels ? this.draftMarkerLabel(name, index) : null,
        )
      })
    )
  }

  draftMarkerLabel(name, timelineIndex, inDrawer) {
    const markerNo = this.markerIndexFromTimelineIndex(timelineIndex)
    return e('div', {
      className: 'draft-marker-label' + (this.state.editingDraftMarker === markerNo + (inDrawer ? '-drawer' : '') ? ' editing' : ''),
      onClick: (evt) => evt.stopPropagation()
    },
      e('span', {
        onClick: this.editDraftMarkerLabel(markerNo, inDrawer),
      }, this.draftMarkerName(name, markerNo)),
      e('input', {
        id: 'draft-marker-' + markerNo + (inDrawer ? '-in-drawer' : ''),
        defaultValue: name,
        onKeyDown: this.draftMarkerLabelOnKeyDown(markerNo),
      }),
    )
  }

  drawer() {
    const { drawerOpen, markers, showDraftMarkers, showDraftMarkerLabels } = this.state
    const reversedMarkers = [].concat(markers).reverse()
    const fooMarkers = reversedMarkers
      .concat(reversedMarkers)
      .concat(reversedMarkers)
      .concat(reversedMarkers)
      .concat(reversedMarkers)
      .concat(reversedMarkers)

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
    const { focusMode, title, drawerOpen } = this.state

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
            this.quillToolbar(),
            this.midstToolbar(),
          ),
        ),
        e('div', { className: 'main' + (drawerOpen ? ' drawer-open' : '') },
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