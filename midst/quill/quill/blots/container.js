const Parchment = require('../../parchment').default;
const Block = require('./block');
const { BlockEmbed } = require('./block');


class Container extends Parchment.Container { }
Container.allowedChildren = [Block, BlockEmbed, Container];


module.exports = Container;
