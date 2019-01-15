class Rewind extends React.Component {
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
      e('polygon', { points: '11 19 2 12 11 5 11 19' }),
      e('polygon', { points: '22 19 13 12 22 5 22 19' })
    )
  }
}
