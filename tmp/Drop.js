// ================================================================================
// Constructor
// ================================================================================
class Drop extends React.Component {
    static get defaultProps() {
      return {
        label: 'Label',
        open: false,
        controlled: false,
        styleChildren: true,
        onDropToggled: null,
        direction: 'down',
      }
    }

    constructor(props) {
      super(props)
  // ================================================================================
  // Initial State
  // ================================================================================
    this.state = {
      open: false,
    }

  // ================================================================================
  // Bound Methods
  // ================================================================================
    this.onToggleClicked = this.onToggleClicked.bind(this)

  // ================================================================================
  // Styles
  // ================================================================================
      this.css = () => `
        .drop {
          position: relative;
          width: 100px;
          height: 20px;
          border: 1px solid black;
          box-sizing: border-box;
          font-family: sans-serif;
          font-size: 11px;
          text-align: left;
        }

        .drop__toggle {
          position: absolute;
          width: 98px;
          height: 18px;
          line-height: 20px;
          background: #ccc;
          color: #000;
          cursor: pointer;
        }

        .drop__content {
          display: none;
          position: absolute;
          left: -1px;
          width: 100%;
          height: auto;
          border: 1px solid black;
        }

        .style-children .drop__content div,
        .style-children .drop__content a,
        .style-children .drop__content li{
          width: 98px;
          height: 18px;
          line-height: 20px;
          cursor: pointer;
        }

        .style-children .drop__content div:not(:last-child),
        .style-children .drop__content a:not(:last-child),
        .style-children .drop__content li:not(:last-child) {
          border-bottom: 1px solid black;
        }

        .drop.drop--down .drop__content {
          top: 100%;
        }

        .drop.drop--up .drop__content {
          bottom: 100%;
        }

        .drop.drop--open .drop__content {
          display: block;
        }
      `
  // ================================================================================
  // Class Properties
  // ================================================================================#
      this.el = null
    }

  // ================================================================================
  // Lifecycle
  // ================================================================================#
    componentDidMount() {
      appendStyle(this.css())
    }

  // ================================================================================
  // Handlers
  // ================================================================================
    onToggleClicked(evt) {
      evt.stopPropagation()

      if (this.props.onDropToggled) {
        this.props.onDropToggled()
      }

      if (!this.props.controlled) {
        this.setState({ open: !this.state.open })
      }
    }

  // ================================================================================
  // Other Methods
  // ================================================================================
  // N/A

  // ================================================================================
  // Render
  // ================================================================================
    render() {
      const { direction, className, label, children, styleChildren, controlled } = this.props
      const open = controlled ? this.props.open : this.state.open

      return (
        e('div', {
          className: 'drop drop--' + direction
            + (open ? ' drop--open' : '')
            + (styleChildren ? ' style-children' : '')
            + (className ? ' ' + className : null),
        },
          e('div', {
            className: 'drop__toggle',
            onClick: this.onToggleClicked,
          }, label),
          e('div', {
            className: 'drop__content',
          }, children),
        )
      )
    }
  }

  window.Drop = Drop