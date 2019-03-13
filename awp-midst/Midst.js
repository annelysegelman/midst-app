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
      editorDraftMarkers: [],
      editorTimelineFrames: [],
      editorTimelineIndex: 0,
    }

// ================================================================================
// Bound Methods
// ================================================================================
// N/A

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

  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }

// ================================================================================
// Models
// ================================================================================
  draftMarker(data) {
    return {
      author: '',
      description: '',
      name: '',
      timelineIndex: 0,
      timestamp: 0,
    }
  }

  timelineFrame(data) {
    return {
      content: '',
      cursor: [0, 0],
      timestamp: 0,
    }
  }

  midstFile(data) {
    return {
      timelineFrames: [],
      draftMarkers: [],
    }
  }

// ================================================================================
// Handlers
// ================================================================================
// N/A

// ================================================================================
// Other Methods
// ================================================================================
// N/A

// ================================================================================
// Render Helpers
// ================================================================================
  renderHeader() {
    return (
      e('div', {
        className: 'header'
      },

      )
    )
  }

  renderTopToolbar() {
    return (
      e('div', {
        className: 'top-toolbar'
      },

      )
    )
  }

  renderEditor() {
    return (
      e('div', {
        className: 'editor'
      },
        e('div', {
          className: 'editable',
          contentEditable: true,
        }),
      )
    )
  }

  renderBottomToolbar() {
    return (
      e('div', {
        className: 'bottom-toolbar'
      },

      )
    )
  }

  renderTimeline() {
    return (
      e('div', {
        className: 'timeline'
      },

      )
    )
  }

  renderDrawer() {
    return (
      e('div', {
        className: 'drawer'
      },

      )
    )
  }

// ================================================================================
// Render
// ================================================================================
  render() {
    return (
      e('div', { className: 'midst' },
        e('header', { className: 'title-bar' }, this.renderHeader()),
        e('section', { className: 'top-toolbar' }, this.renderTopToolbar()),
        e('main', { className: 'editor' }, this.renderEditor()),
        e('section', { className: 'bottom-toolbar' }, this.renderBottomToolbar()),
        e('section', { className: 'timeline' }, this.renderTimeline()),
        e('aside', { className: 'drawer' }, this.renderDrawer()),
      )
    )
  }
}

window.Midst = Midst
