// ================================================================================
// Constructor
// ================================================================================
class Midst extends React.Component {
  static get defaultProps() {
    return {
      isPlayer: false,
    }
  }

  constructor(props) {
    super(props)

// ================================================================================
// Class Properties
// ================================================================================#
  this.editorFontSizes = [10, 12, 14, 24, 36]
  this.defaultFontSize = 14

// ================================================================================
// Initial State
// ================================================================================
    this.state = {
      appCursorFollowing: true,
      appDrawerOpen: false,
      appFocusMode: false,
      appTimelineMode: false,
      editorCachedSelection: [],
      editorDraftMarkers: [],
      editorFontFamily: 'Helvetica',
      editorFontSize: this.defaultFontSize,
      editorFormatBold: false,
      editorFormatItalic: false,
      editorNumLines: 0,
      editorTimelineFrames: [],
      editorTimelineIndex: 0,
      editorTitle: 'Untitled',
    }

// ================================================================================
// Bound Methods
// ================================================================================
  this.editorOnBlur = this.editorOnBlur.bind(this)
  this.editorOnInput = this.editorOnInput.bind(this)
  this.editorOnKeyDown = this.editorOnKeyDown.bind(this)
  this.editorOnMouseDown = this.editorOnMouseDown.bind(this)
  this.editorOnPaste = this.editorOnPaste.bind(this)
  this.fontSizeDefault = this.fontSizeDefault.bind(this)
  this.fontSizeDown = this.fontSizeDown.bind(this)
  this.fontSizeUp = this.fontSizeUp.bind(this)
  this.setFontFamily = this.setFontFamily.bind(this)
  this.setFontSize = this.setFontSize.bind(this)
  this.toggleDrawer = this.toggleDrawer.bind(this)
  this.toggleFontFormatBold = this.toggleFontFormatBold.bind(this)
  this.toggleTimeline = this.toggleTimeline.bind(this)

// ================================================================================
// Styles
// ================================================================================
// N/A
  }

// ================================================================================
// Lifecycle
// ================================================================================#
  componentDidMount() {
    this.$editable = $('#editable')

    // Force first line of contenteditable to be wrapped in a <p>.
    this.$editable.html('<p><br></p>')

    this.$editable.on('blur', this.editorOnBlur)
    this.$editable.on('input', this.editorOnInput)
    this.$editable.on('keydown', this.editorOnKeyDown)
    this.$editable.on('keyup', this.editorOnKeyUp)
    this.$editable.on('mousedown', this.editorOnMouseDown)
    this.$editable.on('paste', this.editorOnPaste)

    if (typeof ipc !== 'undefined') {
      ipc.on('menu.cursorFollowingOff', () => this.setState({ cursorFollowing: false }))
      ipc.on('menu.cursorFollowingOn', () => this.setState({ cursorFollowing: true }))
      ipc.on('menu.fontSizeDefault', this.fontSizeDefault)
      ipc.on('menu.fontSizeDown', this.fontSizeDown)
      ipc.on('menu.fontSizeUp', this.fontSizeUp)
      ipc.on('menu.setFontFamily', this.setFontFamily)
      ipc.on('menu.setFontSize', this.setFontSize)
      ipc.on('menu.toggleFontFormatBold', this.toggleFontFormatBold)
      // ipc.on('menu.toggleFontFormatItalic', this.toggleFontFormatItalic)
      // ipc.on('menu.newFile', this.newFile)
      // ipc.on('menu.openFile', this.openFile)
      // ipc.on('menu.saveFile', this.saveFile)
      // ipc.on('menu.saveFileAs', this.saveFileAs)

      ipc.on('fileOpened', (evt, fileData) => this.load(fileData))
    }
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.$editable.off('blur')
    this.$editable.off('input')
    this.$editable.off('keydown')
    this.$editable.off('keyup')
    this.$editable.off('mousedown')
    this.$editable.off('paste')
  }

// ================================================================================
// Models
// ================================================================================
  modelDraftMarker(data) {
    return {
      author: '',
      description: '',
      name: '',
      timelineIndex: 0,
      timestamp: 0,
    }
  }

  modelTimelineFrame({ content, lineNumber, timestamp }) {
    return {
      content,
      lineNumber,
      timestamp,
    }
  }

  modelMidstFile({ timelineFrames, draftMarkers, fontFamily, fontSize }) {
    return {
      timelineFrames,
      draftMarkers,
      fontFamily,
      fontSize,
    }
  }

// ================================================================================
// Handlers
// ================================================================================
  editorOnKeyUp(evt) {
    if (evt.keyCode === 13) {
      // Use <p>'s instead of <div>'s.
      document.execCommand('formatBlock', false, 'p')
    }
  }

  editorOnInput() {
    this.reflowLineNumbers()
    this.captureTimelineFrame(this.$editable.html())
    this.detectFormatting()
  }

  editorOnBlur() {
    saveSelection()
    setTimeout(() => {
      // restoreSelection()
    }, 1)
  }

  editorOnPaste(evt) {
    this.detectFormatting()
    // evt.preventDefault()

    // let content

    // if (window.clipboardData) {
    //   content = window.clipboardData.getData('Text')

    //   if (window.getSelection) {
    //     const selObj = window.getSelection()
    //     const selRange = selObj.getRangeAt(0)
    //     selRange.deleteContents()
    //     selRange.insertNode(document.createTextNode(content))
    //   }
    // } else if (evt.originalEvent.clipboardData) {
    //   content = (evt.originalEvent || evt).clipboardData.getData('text/plain')
    //   document.execCommand('insertText', false, content)
    // }
  }

  editorOnKeyDown(evt) {
    const { editorFormatBold } = this.state

    this.detectFormatting()

    if (evt.keyCode === 9) {
      evt.preventDefault()
      document.execCommand('insertText', false, '\t')
    }

    if (evt.metaKey) {
      if (evt.keyCode === 66) {
        this.setState({ editorFormatBold: !editorFormatBold })
      }
    }
  }

  editorOnMouseDown(evt) {
    this.detectFormatting(evt)
  }

  toggleTimeline() {
    this.setState({
      appTimelineMode: !this.state.appTimelineMode,
    }, () => {
      if (!this.state.appTimelineMode && this.state.appDrawerOpen) {
        this.setState({
          appDrawerOpen: false,
        })
      }
    })
  }

  toggleDrawer() {
    this.setState({
      appDrawerOpen: !this.state.appDrawerOpen,
    }, () => {
      if (this.state.appDrawerOpen) {
        this.setState({
          appTimelineMode: true,
        })
      }

      else {
        this.setState({
          appTimelineMode: false,
        })
      }
    })
  }

  fontSizeDown() {
    const { editorFontSize } = this.state
    const index = this.editorFontSizes.indexOf(editorFontSize)

    if (index > 0) {
      this.setState({
        editorFontSize: this.editorFontSizes[index - 1]
      })
    }
  }

  fontSizeUp() {
    const { editorFontSize } = this.state
    const index = this.editorFontSizes.indexOf(editorFontSize)
    if (index > -1 && index < this.editorFontSizes.length - 1) {
      this.setState({
        editorFontSize: this.editorFontSizes[index + 1]
      })
    }
  }

  fontSizeDefault() {
    this.setState({ editorFontSize: this.defaultFontSize })
  }

  setFontFamily(evt, data) {
    this.setState({ editorFontFamily: data })
  }

  setFontSize(evt, data) {
    this.setState({ editorFontSize: data })
  }

  toggleFontFormatBold() {
    document.execCommand('bold')
    this.setState({ editorFormatBold: !this.state.editorFormatBold })
  }

// ================================================================================
// Other Methods
// ================================================================================
  detectFormatting(evt) {
    if (evt) {
      if (evt.target.tagName === 'B') {
        this.setState({ editorFormatBold: true })
      }

      if (evt.target.tagName === 'P') {
        this.setState({ editorFormatBold: false })
      }
    }

    else {
      const $boldElement = $(window.getSelection().anchorNode).parents('b')

      if ($boldElement.length) {
        this.setState({ editorFormatBold: true })
      }

      else {
        this.setState({ editorFormatBold: false })
      }
    }
  }

  reflowLineNumbers(force) {
    const $lines = this.$editable.find('p')

    if (force || (this.editorNumLines !== $lines.length)) {
      $lines.each(function(i) {
        $(this).attr('data-line-number', i)
      })
      this.editorNumLines = $lines.length
    }
  }

  captureTimelineFrame(content) {
    const { editorTimelineFrames } = this.state
    const $emptyLine = $(window.getSelection().anchorNode)
    const $emptyLineRoot = $emptyLine.parents('p')
    const $line = $emptyLineRoot.length ? $emptyLineRoot : $emptyLine
    const lineNumber = $line.attr('data-line-number')

    const nextFrame = this.modelTimelineFrame({
      content,
      lineNumber,
      timestamp: + new Date(),
    })

    this.setState({
      editorTimelineFrames: editorTimelineFrames.concat([nextFrame])
    })
  }

// ================================================================================
// Render Helpers
// ================================================================================
  renderHeader() {
    const { editorTitle } = this.state

    return (
      e('div', {
        className: 'title-bar'
      },
        e('div', { className: 'title' }, editorTitle)
      )
    )
  }

  renderTopToolbar() {
    const { appFocusMode, editorFormatBold, editorFormatItalic } = this.state

    return (
      e('div', {
        className: 'top-toolbar'
      },
        e('h1', { className: 'logo' },
          e('span', {}),
        ),
        e('div', {
          className: 'round-icon bold-toggle' + (editorFormatBold ? ' active' : ''),
          onClick: this.toggleFontFormatBold,
        }),
        e('div', {
          className: 'round-icon italic-toggle' + (editorFormatItalic ? ' active' : ''),
          onClick: this.toggleFontFormatItalic,
        }),
        e('div', {
          className: 'big-round-icon focus-mode-toggle' + (appFocusMode ? ' active' : ''),
          // onClick: this.,
        }),
      )
    )
  }

  renderEditor() {
    const { editorFontFamily, editorFontSize } = this.state

    return (
      e('div', {
        className: 'editor',
        style: {
          fontFamily: editorFontFamily,
          fontSize: editorFontSize + 'px',
        },
      },
        e('div', {
          id: 'editable',
          contentEditable: true,
        }),
      )
    )
  }

  renderBottomToolbar() {
    const { appTimelineMode, appDrawerOpen } = this.state

    return (
      e('div', {
        className: 'bottom-toolbar'
      },
        e('div', { className: 'double-icon timeline-toggles' },
          e('div', {
            className: 'icon timeline-toggle' + (appTimelineMode ? ' active' : ''),
            onClick: this.toggleTimeline,
          }),
          e('div', {
            className: 'icon drawer-toggle' + (appDrawerOpen ? ' active' : ''),
            onClick: this.toggleDrawer,
          }),
        ),
      )
    )
  }

  renderTimeline() {
    const { appTimelineMode }  = this.state

    return (
      e('div', {
        className: 'timeline' + (appTimelineMode ? ' open' : ''),
        onClick: () => this.toggleTimeline(),
      },

      )
    )
  }

  renderDrawer() {
    const { appDrawerOpen }  = this.state

    return (
      e('div', {
        className: 'drawer' + (appDrawerOpen ? ' open' : '')
      },

      )
    )
  }

// ================================================================================
// Render
// ================================================================================
  render() {
    const { appFocusMode } = this.state

    return (
      e('div', { className: 'midst' + (appFocusMode ? ' focus-mode' : '')},
        e('header', { id: 'title-bar' }, this.renderHeader()),
        e('section', { id: 'top-toolbar' }, this.renderTopToolbar()),
        e('main', {}, this.renderEditor()),
        e('section', { id: 'bottom-toolbar' }, this.renderBottomToolbar()),
        e('section', { id: 'timeline' }, this.renderTimeline()),
        e('aside', { id: 'drawer' }, this.renderDrawer()),
      )
    )
  }
}

window.Midst = Midst
