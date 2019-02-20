const Parchment = require('parchment');
const { ColorAttributor } = require('./color');

let BackgroundClass = new Parchment.Attributor.Class('background', 'ql-bg', {
  scope: Parchment.Scope.INLINE
});
let BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Parchment.Scope.INLINE
});

module.exports = { BackgroundClass, BackgroundStyle };
