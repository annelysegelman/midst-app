const Quill = require('./core');

const { AlignClass, AlignStyle } = require('./formats/align');
const { DirectionAttribute, DirectionClass, DirectionStyle } = require('./formats/direction');
const { IndentClass } = require('./formats/indent');
const Indent = IndentClass

const Blockquote = require('./formats/blockquote');
const Header = require('./formats/header');
const List, { ListItem } = require('./formats/list');

const { BackgroundClass, BackgroundStyle } = require('./formats/background');
const { ColorClass, ColorStyle } = require('./formats/color');
const { FontClass, FontStyle } = require('./formats/font');
const { SizeClass, SizeStyle } = require('./formats/size');

const Bold = require('./formats/bold');
const Italic = require('./formats/italic');
const Link = require('./formats/link');
const Script = require('./formats/script');
const Strike = require('./formats/strike');
const Underline = require('./formats/underline');

const Image = require('./formats/image');
const Video = require('./formats/video');

const CodeBlock, { Code } = require('./formats/code');
const InlineCode = Code

const Formula = require('./modules/formula');
const Syntax = require('./modules/syntax');
const Toolbar = require('./modules/toolbar');

const Icons = require('./ui/icons');
const Picker = require('./ui/picker');
const ColorPicker = require('./ui/color-picker');
const IconPicker = require('./ui/icon-picker');
const Tooltip = require('./ui/tooltip');

const BubbleTheme = require('./themes/bubble');
const SnowTheme = require('./themes/snow');


Quill.register({
  'attributors/attribute/direction': DirectionAttribute,

  'attributors/class/align': AlignClass,
  'attributors/class/background': BackgroundClass,
  'attributors/class/color': ColorClass,
  'attributors/class/direction': DirectionClass,
  'attributors/class/font': FontClass,
  'attributors/class/size': SizeClass,

  'attributors/style/align': AlignStyle,
  'attributors/style/background': BackgroundStyle,
  'attributors/style/color': ColorStyle,
  'attributors/style/direction': DirectionStyle,
  'attributors/style/font': FontStyle,
  'attributors/style/size': SizeStyle
}, true);


Quill.register({
  'formats/align': AlignClass,
  'formats/direction': DirectionClass,
  'formats/indent': Indent,

  'formats/background': BackgroundStyle,
  'formats/color': ColorStyle,
  'formats/font': FontClass,
  'formats/size': SizeClass,

  'formats/blockquote': Blockquote,
  'formats/code-block': CodeBlock,
  'formats/header': Header,
  'formats/list': List,

  'formats/bold': Bold,
  'formats/code': InlineCode,
  'formats/italic': Italic,
  'formats/link': Link,
  'formats/script': Script,
  'formats/strike': Strike,
  'formats/underline': Underline,

  'formats/image': Image,
  'formats/video': Video,

  'formats/list/item': ListItem,

  'modules/formula': Formula,
  'modules/syntax': Syntax,
  'modules/toolbar': Toolbar,

  'themes/bubble': BubbleTheme,
  'themes/snow': SnowTheme,

  'ui/icons': Icons,
  'ui/picker': Picker,
  'ui/icon-picker': IconPicker,
  'ui/color-picker': ColorPicker,
  'ui/tooltip': Tooltip
}, true);


module.exports = Quill;
