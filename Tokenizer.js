class Tokenizer {
  init(code) {
    this._code = code;
    this._cursor = 0;
  }

  isEOF() {
    return this._cursor >= this._code.length;
  }

  hasMoreTokens() {
    return this._cursor < this._code.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._code.slice(this._cursor);

    // Numbers
    if (!Number.isNaN(Number(string[0]))) {
      let number = '';

      while(!Number.isNaN(Number(string[this._cursor]))) {
        number += string[this._cursor++];
      }

      return {
        type: 'NUMBER',
        value: number,
      };
    }

    // Strings
    if (string[0] === '"') {
      let stringChar = '';

      do {
        stringChar += string[this._cursor++];
      } while(string[this._cursor] !== '"' && !this.isEOF());

      stringChar += this._cursor++;

      // string += string[this._cursor++];

      return {
        type: 'STRING',
        value: stringChar,
      };
    }

  }
}

module.exports = {
  Tokenizer,
};
