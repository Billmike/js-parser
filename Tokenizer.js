const Spec = [
  // Numbers
  [/^\d+/, 'NUMBER'],

  // Symbols, delimiters
  [/^;/, 'SEMICOLON'],
  [/^\(/, 'PAREN_OPEN'],
  [/^\)/, 'PAREN_CLOSE'],
  [/^\{/, 'BRACE_OPEN'],
  [/^\}/, 'BRACE_CLOSE'],
  [/^\[/, 'SQUARE_BRACKET_OPEN'],
  [/^\]/, 'SQUARE_BRACKET_CLOSE'],
  [/^\./, 'DOT'],
  [/^,/, 'COMMA'],

  // Keywords
  [/^\blet\b/, 'LET'],
  [/^\bif\b/, 'IF'],
  [/^\belse\b/, 'ELSE'],
  [/^\btrue\b/, 'TRUE'],
  [/^\bfalse\b/, 'FALSE'],
  [/^\bnull\b/, 'NULL'],
  [/^\bwhile\b/, 'WHILE'],
  [/^\bdo\b/, 'DO'],
  [/^\bfor\b/, 'FOR'],
  [/^\bdef\b/, 'DEF'],
  [/^\breturn\b/, 'RETURN'],
  [/^\bclass\b/, 'CLASS'],
  [/^\bextends\b/, 'EXTENDS'],
  [/^\bsuper\b/, 'SUPER'],
  [/^\bnew\b/, 'NEW'],
  [/^\bthis\b/, 'THIS'],

  // Identifiers
  [/^\w+/, 'IDENTIFIER'],

  // Equality operators: ==, !=
  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  // Assignment operators: =, +=, -=, *=, /=, *=
  [/^=/, 'SIMPLE_ASSIGN'],
  [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],

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

  // Operators
  [/^[+\-]/, 'PLUS_OPERATOR'],
  [/^[*\/]/, 'MULTIPLY_OPERATOR'],
  [/^[<>]=?/, 'RELATIONAL_OPERATOR'],
  [/^&&/, 'LOGICAL_AND'],
  [/^\|\|/, 'LOGICAL_OR'],
  [/^!/, 'LOGICAL_NOT'],
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
