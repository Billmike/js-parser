const { Tokenizer } = require('./Tokenizer');

class Parser {
  constructor() {
    this._tokenizer = new Tokenizer();
    this._code = '';
  }
    parse(code) {
      this._code = code;
      this._tokenizer.init(code);

      this._lookahead = this._tokenizer.getNextToken();

      return this.Program();
    };

    Program() {
      return {
        type: 'Program',
        body: this.StatementList(),
      };
    }

    /**
     * StatementList
     * 
     */
    StatementList() {
      const statementList = [this.Statement()];

      while(this._lookahead !== null) {
        statementList.push(this.Statement());
      }

      return statementList
    }

    Statement() {
      return this.ExpressionStatement();
    }

    ExpressionStatement() {
      const expression = this.Expression();
      this._eat('SEMICOLON');
      return {
        type: 'ExpressionStatement',
        expression,
      };
    }

    Expression() {
      return this.Literal();
    }

    Literal() {
      switch(this._lookahead.type) {
        case 'NUMBER':
          return this.NumericalLiteral();
        case 'STRING':
          return this.StringLiteral();
      }

      throw new SyntaxError(`Literal: Unexpected literal production`);
    }

    StringLiteral() {
      const token = this._eat('STRING');
      return {
        type: 'StringLiteral',
        value: token.value.slice(1, -1),
      };
    }

    NumericalLiteral() {
      const token = this._eat('NUMBER');
      return {
        type: 'NumericalLiteral',
        value: Number(token.value),
      };
    }
    
    _eat(tokenType) {
      const token = this._lookahead;

      if (token === null) {
        throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
      }

      if (token.type !== tokenType) {
        throw new SyntaxError(`Unexpected token: "${token.type}", expected "${tokenType}"`);
      }

      this._lookahead = this._tokenizer.getNextToken();
      return token;
    }
}

module.exports = {
  Parser,
};