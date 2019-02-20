const Parchment = require('parchment');
const Quill = require('./core/quill');

const Block, { BlockEmbed } = require('./blots/block');
const Break = require('./blots/break');
const Container = require('./blots/container');
const Cursor = require('./blots/cursor');
const Embed = require('./blots/embed');
const Inline = require('./blots/inline');
const Scroll = require('./blots/scroll');
const TextBlot = require('./blots/text');

const Clipboard = require('./modules/clipboard');
const History = require('./modules/history');
const Keyboard = require('./modules/keyboard');

Quill.register({
  'blots/block'        : Block,
  'blots/block/embed'  : BlockEmbed,
  'blots/break'        : Break,
  'blots/container'    : Container,
  'blots/cursor'       : Cursor,
  'blots/embed'        : Embed,
  'blots/inline'       : Inline,
  'blots/scroll'       : Scroll,
  'blots/text'         : TextBlot,

  'modules/clipboard'  : Clipboard,
  'modules/history'    : History,
  'modules/keyboard'   : Keyboard
});

Parchment.register(Block, Break, Cursor, Inline, Scroll, TextBlot);


module.exports = Quill;
