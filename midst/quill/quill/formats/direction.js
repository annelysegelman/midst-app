const Parchment = require('../../parchment').default;

let config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['rtl']
};

let DirectionAttribute = new Parchment.Attributor.Attribute('direction', 'dir', config);
let DirectionClass = new Parchment.Attributor.Class('direction', 'ql-direction', config);
let DirectionStyle = new Parchment.Attributor.Style('direction', 'direction', config);

module.exports = { DirectionAttribute, DirectionClass, DirectionStyle };
