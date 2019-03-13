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
// Initial State
// ================================================================================
    this.state = {
      appCursorFollowing: true,
      appDrawerOpen: false,
      appFocusMode: false,
      appTimelineMode: false,
      editorCachedSelection: [],
      editorDraftMarkers: [],
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
  this.editorOnPaste = this.editorOnPaste.bind(this)
  this.toggleDrawer = this.toggleDrawer.bind(this)
  this.toggleTimeline = this.toggleTimeline.bind(this)

// ================================================================================
// Styles
// ================================================================================
// N/A

// ================================================================================
// Class Properties
// ================================================================================#
// N/A
  }

// ================================================================================
// Lifecycle
// ================================================================================#
  componentDidMount() {
    $.fn.selectRange = function(start, end) {
      return this.each(function() {
        if (this.setSelectionRange) {
          this.focus()
          this.setSelectionRange(start, end)
        } else if (this.createTextRange) {
          var range = this.createTextRange()
          range.collapse(true)
          range.moveEnd('character', end)
          range.moveStart('character', start)
          range.select()
        }
      })
    }

    this.$editable = $('#editable')

    this.$editable.on('keyup', (evt) => {
      evt = evt || window.event
      if (evt.keyCode === 13) {
        document.execCommand('formatBlock', false, 'p')
      }
    })

    this.$editable.html('<p><br></p>')

    this.$editable.on('blur', this.editorOnBlur)
    this.$editable.on('input', this.editorOnInput)
    this.$editable.on('paste', this.editorOnPaste)
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.$editable.off('blur')
    this.$editable.off('input')
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

  modelMidstFile(data) {
    return {
      timelineFrames: [],
      draftMarkers: [],
    }
  }

// ================================================================================
// Handlers
// ================================================================================
  editorOnInput() {
    this.reflowLineNumbers()
    this.captureTimelineFrame(this.$editable.html())
  }

  editorOnBlur() {
    saveSelection()
    setTimeout(() => {
      restoreSelection()
    }, 1)
  }

  editorOnPaste(evt) {
    evt.preventDefault()

    let content

    if (window.clipboardData) {
      content = window.clipboardData.getData('Text')

      if (window.getSelection) {
        const selObj = window.getSelection()
        const selRange = selObj.getRangeAt(0)
        selRange.deleteContents()
        selRange.insertNode(document.createTextNode(content))
      }
    } else if (evt.originalEvent.clipboardData) {
      content = (evt.originalEvent || evt).clipboardData.getData('text/plain')
      document.execCommand('insertText', false, content)
    }
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
    })
  }

// ================================================================================
// Other Methods
// ================================================================================
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
    const { appFocusMode } = this.state

    return (
      e('div', {
        className: 'top-toolbar'
      },
        e('h1', { className: 'logo' },
          e('span', {}),
        ),
        e('div', { className: 'round-icon focus-mode-toggle' + (appFocusMode ? ' active' : '') }),
      )
    )
  }

  renderEditor() {
    return (
      e('div', {
        className: 'editor'
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
    const { appTimelineMode, appDrawerOpen }  = this.state

    return (
      e('div', {
        className: 'timeline' + (appTimelineMode ? ' open' : '')
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
      e('div', { className: 'midst' + (appFocusMode ? ' focus-mode' : '') },
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
