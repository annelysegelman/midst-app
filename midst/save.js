class Save extends React.Component {
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
      e('path', { d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' }),
      e('polyline', { points: '17 21 17 13 7 13 7 21' }),
      e('polyline', { points: '7 3 7 8 15 8' })
    )
  }
}