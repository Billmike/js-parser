const Spec = [
  // Numbers
  [/^\d+/, 'NUMBER'],

  // Semicolons
  [/^;/, 'SEMICOLON'],

  // Strings
  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING'],

  // Whitespace
  [/^\s+/, null],

  // Comments

  // Skip single line comments
  [/^\/\/.*/, null],

  // Skip multi line comments
  [/^\/\*[\s\S]*?\*\//, null],
];

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

  _match(regexp, string) {
    const matched = regexp.exec(string);
    if (matched === null) {
      return null;
    }

    this._cursor += matched[0].length;
    return matched[0];
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._code.slice(this._cursor);

    for (const [regexp, type] of Spec) {
      const tokenValue = this._match(regexp, string);

      if (tokenValue === null) {
        continue;
      }

      if (type === null) {
        return this.getNextToken();
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }
}

module.exports = {
  Tokenizer,
};
