class Pause extends React.Component {
    render() {
      return e('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#000',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        e('rect', { x: '6', y: '4', width: '4', height: '16' }),
        e('rect', { x: '14', y: '4', width: '4', height: '16' }),
      )
    }
  }
