const Parchment = require('../../parchment').default;

class Break extends Parchment.Embed {
  static value() {
    return undefined;
  }

  insertInto(parent, ref) {
    if (parent.children.length === 0) {
      super.insertInto(parent, ref);
    } else {
      this.remove();
    }
  }

  length() {
    return 0;
  }

  value() {
    return '';
  }
}
Break.blotName = 'break';
Break.tagName = 'BR';


module.exports = Break;
