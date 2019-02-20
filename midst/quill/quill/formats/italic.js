const Bold = require('./bold');

class Italic extends Bold { }
Italic.blotName = 'italic';
Italic.tagName = ['EM', 'I'];

module.exports = Italic;
