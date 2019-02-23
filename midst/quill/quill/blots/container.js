const Parchment = require('../../parchment').default;
const Block = require('./block').default;
const { BlockEmbed } = require('./block').default;


class Container extends Parchment.Container { }
Container.allowedChildren = [Block, BlockEmbed, Container];


module.exports = Container;
