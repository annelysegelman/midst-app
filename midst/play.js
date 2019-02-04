class Play extends React.Component {
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
        e('polygon', { points: '5 3 19 12 5 21 5 3' })
      )
    }
  }
