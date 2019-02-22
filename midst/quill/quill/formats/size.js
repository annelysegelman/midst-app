const Parchment = require('../../parchment').default;

let SizeClass = new Parchment.Attributor.Class('size', 'ql-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['small', 'large', 'huge']
});
let SizeStyle = new Parchment.Attributor.Style('size', 'font-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['10px', '18px', '32px']
});

module.exports = { SizeClass, SizeStyle };
