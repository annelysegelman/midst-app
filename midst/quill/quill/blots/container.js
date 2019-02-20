const Parchment = require('parchment');
const Block, { BlockEmbed } = require('./block');


class Container extends Parchment.Container { }
Container.allowedChildren = [Block, BlockEmbed, Container];


module.exports = Container;
