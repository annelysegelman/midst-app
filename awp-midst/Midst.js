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
      editorPlaying: false,
      editorTimelineFrames: [],
      editorTimelineIndex: 0,
      editorTitle: 'Untitled',
    }

// ================================================================================
// Bound Methods
// ================================================================================
  this.appOnKeyDown = this.appOnKeyDown.bind(this)
  this.editorOnBlur = this.editorOnBlur.bind(this)
  this.editorOnInput = this.editorOnInput.bind(this)
  this.editorOnKeyDown = this.editorOnKeyDown.bind(this)
  this.editorOnMouseDown = this.editorOnMouseDown.bind(this)
  this.editorOnPaste = this.editorOnPaste.bind(this)
  this.fontSizeDefault = this.fontSizeDefault.bind(this)
  this.fontSizeDown = this.fontSizeDown.bind(this)
  this.fontSizeUp = this.fontSizeUp.bind(this)
  this.pause = this.pause.bind(this)
  this.play = this.play.bind(this)
  this.setFontFamily = this.setFontFamily.bind(this)
  this.setFontSize = this.setFontSize.bind(this)
  this.sliderOnChange = this.sliderOnChange.bind(this)
  this.toggleDrawer = this.toggleDrawer.bind(this)
  this.toggleFontFormatBold = this.toggleFontFormatBold.bind(this)
  this.toggleFontFormatItalic = this.toggleFontFormatItalic.bind(this)
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
      ipc.on('menu.toggleFocusMode', this.toggleFocusMode)
      ipc.on('menu.toggleFontFormatBold', this.toggleFontFormatBold)
      // ipc.on('menu.toggleFontFormatItalic', this.toggleFontFormatItalic)
      // ipc.on('menu.newFile', this.newFile)
      // ipc.on('menu.openFile', this.openFile)
      // ipc.on('menu.saveFile', this.saveFile)
      // ipc.on('menu.saveFileAs', this.saveFileAs)

      ipc.on('fileOpened', (evt, fileData) => this.load(fileData))
    }

    this.$app = $('.midst')

    this.$app.on('keydown', this.appOnKeyDown)
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
    this.$app.off('keydown')
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
  appOnKeyDown(evt) {
    const { appTimelineMode, editorTimelineIndex } = this.state

    if (appTimelineMode) {
      if (evt.keyCode === 37) {
        this.setPos(editorTimelineIndex - 1)
      }

      else if (evt.keyCode === 39) {
        this.setPos(editorTimelineIndex + 1)
      }
    }
  }

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
    // setTimeout(() => {
    //   // restoreSelection()
    // }, 1)
  }

  editorOnPaste(evt) {
    this.detectFormatting()
    evt.preventDefault()

    if (evt.originalEvent.clipboardData) {
      const htmlContent = evt.originalEvent.clipboardData.getData('text/html')
      const textContent = evt.originalEvent.clipboardData.getData('text/plain')
      const contentIsHtml = htmlContent.length
      let content = contentIsHtml ? htmlContent : textContent


      if (contentIsHtml) {
        if (content.includes('<body>')) {
          content = content.split('<body>')[1].split('</body>')[0]
        }

        const o = 'HTML_OPEN_TAG'
        const c = 'HTML_CLOSE_TAG'

        content = content.replace(/<p[ a-zA-Z0-9="':;-]*>/g, o + 'p' + c)
        content = content.replace(/<\/p>/g, o + '/p' + c)
        content = content.replace(/<b>/g, o + 'b' + c)
        content = content.replace(/<\/b>/g, o + '/b' + c)
        content = content.replace(/<i>/g, o + 'i' + c)
        content = content.replace(/<\/i>/g, o + '/i' + c)
        content = content.replace(/(<([^>]+)>)/ig, '')

        content = content.replace(/HTML_OPEN_TAG/g, '<')
        content = content.replace(/HTML_CLOSE_TAG/g, '>')
      }

      document.execCommand('insertHtml', false, content)
    }
  }

  editorOnKeyDown(evt) {
    const { editorFormatBold, editorFormatItalic } = this.state

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

      if (evt.keyCode === 73) {
        this.setState({ editorFormatItalic: !editorFormatItalic })
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
      // if (this.state.appDrawerOpen) {
      //   this.setState({
      //     appTimelineMode: true,
      //   })
      // }

      // else {
      //   this.setState({
      //     appTimelineMode: false,
      //   })
      // }
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
    this.$editable.focus()
    document.execCommand('bold')
    this.setState({ editorFormatBold: !this.state.editorFormatBold })
  }

  toggleFontFormatItalic() {
    this.$editable.focus()
    document.execCommand('italic')
    this.setState({ editorFormatItalic: !this.state.editorFormatItalic })
  }

  sliderOnChange(val) {
    const index = Math.ceil(this.state.editorTimelineFrames.length * val)
    this.setPos(index)
  }

// ================================================================================
// Other Methods
// ================================================================================
  hasBoldFormatting($el) {
    return (
      $el.prop('tagName') === 'B'
        || $el.parents('b').length
        || $el.children('b').length
    )
  }

  hasItalicFormatting($el) {
    return (
      $el.prop('tagName') === 'I'
        || $el.parents('i').length
        || $el.children('i').length
    )
  }

  detectFormatting(evt) {
    if (this.$editable.text().length < 2) return

    if (evt) {
      const $target = $(evt.target)
      const $subject = $target.prop('tagName') === 'P'
        ? $target.children().last()
        : $target

      this.setState({
        editorFormatBold: this.hasBoldFormatting($subject),
        editorFormatItalic: this.hasItalicFormatting($subject),
      })
    }

    else {
      const $subject = $(window.getSelection().anchorNode)
      const $lineElement = $(window.getSelection().anchorNode).parents('p')
      const lineElementText = $lineElement.text()
      const hasFormatting = this.hasBoldFormatting($subject) || this.hasItalicFormatting($subject)

      if (hasFormatting) {
        this.setState({
          editorFormatBold: this.hasBoldFormatting($subject),
          editorFormatItalic: this.hasItalicFormatting($subject),
        })
      }

      else if (lineElementText && lineElementText.length) {
        this.setState({
          editorFormatBold: false,
          editorFormatBold: false
        })
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
      appTimelineMode: false,
      editorTimelineIndex: editorTimelineFrames.length,
      editorTimelineFrames: editorTimelineFrames.concat([nextFrame])
    })
  }

  setPos(index) {
    this.setState({ editorTimelineIndex: index }, () => {
      if (this.state.editorTimelineFrames[index]) {
        this.$editable.html(this.state.editorTimelineFrames[index].content)
      }
    })
  }

  play() {
    if (this.state.editorTimelineIndex >= this.state.editorTimelineFrames.length - 1) {
      this.setPos(0)
    }

    this.setState({ editorPlaying: true }, this.autoScrub)
  }

  pause() {
    this.setState({ editorPlaying: false })
  }

  autoScrub() {
    const { editorPlaying, playbackSpeed, editorTimelineIndex, editorTimelineFrames } = this.state

    if (!editorPlaying) return

    if (editorTimelineIndex === undefined || editorTimelineIndex >= editorTimelineFrames.length) {
      this.setState({ editorPlaying: false })
      return
    }

    const advanceBy = playbackSpeed >= 1 ? playbackSpeed * 2 : 1
    const timeout = playbackSpeed < 1 ? (1 / playbackSpeed) * 50 : 1

    setTimeout(() => {
      this.setPos(editorTimelineIndex + advanceBy)
      this.autoScrub()
    }, timeout)
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
          e('svg', { viewBox: '0 0 182.2 96' },
            e('path', {
              // d: 'M18.9,85.51a12.14,12.14,0,0,1-3.57-.64A10.38,10.38,0,0,1,8.26,74.73a4,4,0,0,1,8,.23,2.44,2.44,0,0,0,1.67,2.34c.79.28,8.17,2.08,23.06-18.23C50,46.77,64.76,27.32,70.32,20l1.78-2.35C77.72,10.22,82.54,7.58,86.42,9.8c2.46,1.41,4.62,4.93,1,13.74-1.2,2.9-14,33.08-16.72,39.11-.13.3-.29.64-.46,1,6.61-9.27,16.94-25.22,23.62-35.52,3.11-4.8,5.36-8.27,6.25-9.56,2.57-3.7,7.45-6.59,11.44-4.63,2.55,1.25,5.06,4.45,2.5,12.65-.56,1.81-3.5,10-6.34,17.84-2.15,6-4.18,11.59-4.89,13.67l-.57,1.65c-.49,1.44-1.06,3.07-1.55,4.62.7-1.09,1.54-2.47,2.52-4.22,6-10.61,12.67-23.55,16.67-31.27,1.41-2.73,2.48-4.81,3.07-5.9,3.58-6.68,8.59-8.14,12.08-7.28a8.2,8.2,0,0,1,6.08,8.15c0,2.7-1.62,7.22-4.53,15l-1.45,3.88c-2.14,5.8-7.49,21.21-5.94,21.67.75.38,2.83-2.07,4.49-6.06,5.6-13.45,10.53-25.53,12.87-31.52s6.53-9.25,11.37-9.11h.1a9.56,9.56,0,0,1,8.75,6.83c1.18,3.88-.72,9.31-3.36,16.82l-.34,1c-.88,2.51-1.36,3.81-1.83,5.11s-.86,2.34-1.6,4.45c-1,3-1.33,5-.55,6.27a4,4,0,0,0,3.42,1.58l3.12.09a4,4,0,1,1-.23,8l-3.12-.09c-5.37-.15-8.18-2.62-9.58-4.66-1.65-2.41-3.1-6.76-.61-13.83.76-2.15,1.2-3.35,1.64-4.55s.93-2.54,1.79-5l.34-1c1.52-4.33,3.6-10.26,3.25-11.87a1.54,1.54,0,0,0-1.4-1.14h0c-1,0-2.52,1-3.7,4-2.36,6-7.31,18.18-12.93,31.68-3.52,8.45-8.35,12-14.14,10.92a6.82,6.82,0,0,1-5-4c-2.48-5-.06-12.81,5.65-28.31.49-1.31,1-2.63,1.47-3.93,1.67-4.46,4-10.58,4-12.13a.37.37,0,0,0-.47-.38c-.51.11-1.49,1.1-2.65,3.25-.57,1.08-1.62,3.11-3,5.79-4,7.77-10.74,20.79-16.8,31.53-5.29,9.39-8.37,12.37-12.65,12.25a6,6,0,0,1-4.94-2.54c-2.43-3.51-.73-8.45,2.09-16.64l.56-1.64c.73-2.14,2.77-7.8,4.93-13.79,2.68-7.44,5.72-15.87,6.24-17.52.13-.42.24-.8.33-1.15l-.06.08c-.83,1.19-3.16,4.79-6.12,9.36-8.28,12.78-22.15,34.17-28,41.36-2.7,3.33-5.27,5-7.86,5a5.9,5.9,0,0,1-4.59-2c-3-3.36-1-8.35,3.28-17.61,2.68-5.88,15-35,16.53-38.68-.45.53-.94,1.14-1.46,1.82l-1.79,2.36c-5.55,7.31-20.28,26.73-29.25,39C34.61,81.31,25.2,85.69,18.9,85.51Z',
              d: 'M22.51,82.3l-.53,0a11.05,11.05,0,0,1-8.62-5.16,1,1,0,0,1,.37-1.37,1,1,0,0,1,1.37.38,9,9,0,0,0,7,4.16c4.47.25,12.14-2.61,23.32-17.71C52.56,53,62.83,38.87,69.63,29.52,72.69,25.31,75,22.11,76,20.81c4.29-5.84,8.07-8.45,10.34-7.19,2,1.11,2,4.66-.17,10C85,26.52,72.68,56.76,70,62.84c-1.72,3.91-4.93,11.18-4,12.24a.93.93,0,0,0,.75.32c.46,0,1.79-.37,4.06-3.26,5.56-7,19.06-28.49,27.12-41.3,3-4.81,5.22-8.29,6.07-9.56,1.81-2.68,5.23-4.88,7.61-3.75,1.5.71,2.92,2.86,1.07,9-.52,1.76-3.35,10-6.08,17.86-2.06,6-4,11.62-4.7,13.73l-.55,1.65C99.57,65.36,97.85,70.6,98.86,72c.07.1.25.36,1,.37.93,0,2.65,0,8-9.81,6.25-11.45,13.43-25.5,17.29-33,1-2,1.81-3.55,2.27-4.44,2.71-5.2,6.24-6.46,8.64-5.9a5.24,5.24,0,0,1,3.88,5.21c0,2.05-1.42,6.6-3.27,12.36-.6,1.89-1.23,3.85-1.83,5.79-1,3.21-1.9,6.07-2.71,8.61-2.75,8.6-4.41,13.79-3.3,15.87a2.41,2.41,0,0,0,1.65,1.15c3.53,1,6.53-5.44,7.66-8.25,2.53-6.32,4.9-12.11,6.94-17.1,2.61-6.37,4.66-11.41,5.85-14.56,1.75-4.67,4.94-7.4,8.46-7.31a6.58,6.58,0,0,1,6.06,4.63c.93,2.92-.86,8.25-3.13,15l-.32,1c-1.79,5.33-3,10-4.07,14.33a6.17,6.17,0,0,0,.66,5.3,4.42,4.42,0,0,0,3.62,1.59c.53,0,1.29,0,2.09.09,1.16.06,2.48.13,3.26.1a1,1,0,1,1,.06,2c-.87,0-2.16,0-3.42-.1-.78,0-1.51-.08-2-.09A6.36,6.36,0,0,1,157,62.41c-1.34-1.73-1.7-4.22-1-7,1.06-4.33,2.3-9.09,4.11-14.49l.33-1c2-5.89,3.85-11.46,3.12-13.76A4.6,4.6,0,0,0,159.34,23h-.05c-2.64,0-5.06,2.21-6.49,6-1.2,3.18-3.26,8.23-5.87,14.61-2,5-4.4,10.78-6.93,17.09-2.85,7.12-6.43,10.47-10.07,9.43A4.37,4.37,0,0,1,127.07,68c-1.51-2.82.05-7.7,3.16-17.42C131,48,132,45.17,132.93,42c.6-1.94,1.23-3.91,1.84-5.81,1.65-5.14,3.2-10,3.17-11.7a3.24,3.24,0,0,0-2.33-3.31c-1.67-.39-4.24.69-6.41,4.87l-2.27,4.43c-3.86,7.56-11.05,21.63-17.31,33.09-5,9.18-7.32,10.9-9.82,10.86a3,3,0,0,1-2.57-1.21c-1.6-2.25-.06-6.92,2.27-14l.55-1.66c.69-2.12,2.64-7.77,4.71-13.75,2.6-7.53,5.55-16.06,6.06-17.78,1.28-4.3.83-6.26,0-6.66-1.06-.51-3.51.72-5.09,3.06-.83,1.24-3.13,4.89-6,9.51C91.59,44.75,78.06,66.24,72.43,73.38c-2.05,2.6-3.92,4-5.55,4a2.93,2.93,0,0,1-2.29-1c-1.7-1.83-.13-6,3.58-14.41,2.67-6.06,15-36.26,16.12-39.15,2.15-5.42,1.47-7.29,1.06-7.51-.67-.37-3.45.76-7.76,6.62-1,1.3-3.29,4.5-6.35,8.71-6.8,9.35-17.07,23.48-24.18,33.07C37.87,76.18,29.62,82.41,22.51,82.3Z',
            })
          ),
        ),
        e('div', { className: 'toolbar-icons' },
          e('div', {
            className: 'round-icon focus-mode-toggle' + (appFocusMode ? ' active' : ''),
            onClick: this.toggleFocusMode,
          }, 'F'),
          e('div', {
            className: 'round-icon',
            onClick: this.fontSizeUp,
          }, '+'),
          e('div', {
            className: 'round-icon',
            onClick: this.fontSizeDown,
          }, '-'),
          e('div', {
            className: 'round-icon italic-toggle' + (editorFormatItalic ? ' active' : ''),
            onClick: this.toggleFontFormatItalic,
          }, 'I'),
          e('div', {
            className: 'round-icon bold-toggle' + (editorFormatBold ? ' active' : ''),
            onClick: this.toggleFontFormatBold,
          }, 'B'),
        ),
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
    const { editorTimelineFrames } = this.state

    return (
      e('div', {
        className: 'bottom-toolbar'
      },
        // editorTimelineFrames.length > 50 ?
          e('div', { className: 'double-icon timeline-toggles' },
            e('div', {
              className: 'round-icon drawer-toggle',
              onClick: this.toggleTimeline,
            }, 'T'),
          )
          // : null,
      )
    )
  }

  renderTimeline() {
    const { appTimelineMode, editorTimelineIndex, editorTimelineFrames, editorPlaying } = this.state
    const value = editorTimelineIndex / editorTimelineFrames.length

    return (
      e('div', {
        className: 'timeline' + (appTimelineMode ? ' open' : ''),
        // onClick: () => this.toggleTimeline(),
      },
        e(Slider, {
          id: 'midst-slider',
          hideCursor: false,
          controlled: true,
          readOnly: false, // creatingDraftMarker,
          value,
          onChange: this.sliderOnChange,
          onMouseDown: this.pause,
        }),
        e('div', {
          className: 'round-icon timeline-button-1',
          onClick: () => {
            this.setState({
              appTimelineMode: false,
              appDrawerOpen: false,
            })
          },
          style: {
            backgroundColor: 'red',
          }
        }, 'x'),
        e('div', {
          className: 'round-icon timeline-button-2',
          style: {
            backgroundColor: 'red',
          },
          onClick: this.toggleDrawer,
        }, '='),
        e('div', {
          className: 'round-icon timeline-button-3',
          onClick: editorPlaying ? this.pause : this.play,
          style: {
            backgroundColor: 'red',
          }
        }, '>'),
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
