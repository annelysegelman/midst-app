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
  this.toggleFocusMode = this.toggleFocusMode.bind(this)
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

    if (evt.keyCode === 27) {
      this.setState({
        appFocusMode: false,
      })
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

  toggleFocusMode() {
    this.setState({ appFocusMode: !this.state.appFocusMode })
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
          e('svg', {
            viewBox: '0 0 182.2 96',
          },
            e('path', {
              d: 'M18.9,85.51a12.14,12.14,0,0,1-3.57-.64A10.38,10.38,0,0,1,8.26,74.73a4,4,0,0,1,8,.23,2.44,2.44,0,0,0,1.67,2.34c.79.28,8.17,2.08,23.06-18.23C50,46.77,64.76,27.32,70.32,20l1.78-2.35C77.72,10.22,82.54,7.58,86.42,9.8c2.46,1.41,4.62,4.93,1,13.74-1.2,2.9-14,33.08-16.72,39.11-.13.3-.29.64-.46,1,6.61-9.27,16.94-25.22,23.62-35.52,3.11-4.8,5.36-8.27,6.25-9.56,2.57-3.7,7.45-6.59,11.44-4.63,2.55,1.25,5.06,4.45,2.5,12.65-.56,1.81-3.5,10-6.34,17.84-2.15,6-4.18,11.59-4.89,13.67l-.57,1.65c-.49,1.44-1.06,3.07-1.55,4.62.7-1.09,1.54-2.47,2.52-4.22,6-10.61,12.67-23.55,16.67-31.27,1.41-2.73,2.48-4.81,3.07-5.9,3.58-6.68,8.59-8.14,12.08-7.28a8.2,8.2,0,0,1,6.08,8.15c0,2.7-1.62,7.22-4.53,15l-1.45,3.88c-2.14,5.8-7.49,21.21-5.94,21.67.75.38,2.83-2.07,4.49-6.06,5.6-13.45,10.53-25.53,12.87-31.52s6.53-9.25,11.37-9.11h.1a9.56,9.56,0,0,1,8.75,6.83c1.18,3.88-.72,9.31-3.36,16.82l-.34,1c-.88,2.51-1.36,3.81-1.83,5.11s-.86,2.34-1.6,4.45c-1,3-1.33,5-.55,6.27a4,4,0,0,0,3.42,1.58l3.12.09a4,4,0,1,1-.23,8l-3.12-.09c-5.37-.15-8.18-2.62-9.58-4.66-1.65-2.41-3.1-6.76-.61-13.83.76-2.15,1.2-3.35,1.64-4.55s.93-2.54,1.79-5l.34-1c1.52-4.33,3.6-10.26,3.25-11.87a1.54,1.54,0,0,0-1.4-1.14h0c-1,0-2.52,1-3.7,4-2.36,6-7.31,18.18-12.93,31.68-3.52,8.45-8.35,12-14.14,10.92a6.82,6.82,0,0,1-5-4c-2.48-5-.06-12.81,5.65-28.31.49-1.31,1-2.63,1.47-3.93,1.67-4.46,4-10.58,4-12.13a.37.37,0,0,0-.47-.38c-.51.11-1.49,1.1-2.65,3.25-.57,1.08-1.62,3.11-3,5.79-4,7.77-10.74,20.79-16.8,31.53-5.29,9.39-8.37,12.37-12.65,12.25a6,6,0,0,1-4.94-2.54c-2.43-3.51-.73-8.45,2.09-16.64l.56-1.64c.73-2.14,2.77-7.8,4.93-13.79,2.68-7.44,5.72-15.87,6.24-17.52.13-.42.24-.8.33-1.15l-.06.08c-.83,1.19-3.16,4.79-6.12,9.36-8.28,12.78-22.15,34.17-28,41.36-2.7,3.33-5.27,5-7.86,5a5.9,5.9,0,0,1-4.59-2c-3-3.36-1-8.35,3.28-17.61,2.68-5.88,15-35,16.53-38.68-.45.53-.94,1.14-1.46,1.82l-1.79,2.36c-5.55,7.31-20.28,26.73-29.25,39C34.61,81.31,25.2,85.69,18.9,85.51Z',
            })
          ),
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
          onClick: this.toggleFocusMode,
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
