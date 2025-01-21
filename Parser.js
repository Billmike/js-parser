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
    StatementList(stopLookahead = null) {
      const statementList = [this.Statement()];

      while(this._lookahead !== null && this._lookahead.type !== stopLookahead) {
        statementList.push(this.Statement());
      }

      return statementList
    }

    Statement() {
      switch(this._lookahead.type) {
        case 'SEMICOLON':
          return this.EmptyStatement();
        case 'IF':
          return this.IfStatement();
        case 'BRACE_OPEN':
          return this.BlockStatement();
        case 'LET':
          return this.VariableStatement();
        case 'DEF':
          return this.FunctionDeclaration();
        case 'RETURN':
          return this.ReturnStatement();
        case 'WHILE':
        case 'DO':
        case 'FOR':
          return this.IterationStatement();
        default:
          return this.ExpressionStatement();
      }
    }

    FunctionDeclaration() {
      this._eat('DEF');
      const name = this.Identifier();
      this._eat('PAREN_OPEN');
      const params = this._lookahead.type !== 'PAREN_CLOSE' ? this.FormalParameterList() : [];
      this._eat('PAREN_CLOSE');
      const body = this.BlockStatement();
      return {
        type: 'FunctionDeclaration',
        name,
        params,
        body,
      };
    }

    FormalParameterList() {
      const params = [];

      do {
        params.push(this.Identifier());
      } while (this._lookahead.type === 'COMMA' && this._eat('COMMA'));

      return params;
    }

    ReturnStatement() {
      this._eat('RETURN');
      const argument = this._lookahead.type !== 'SEMICOLON' ? this.Expression() : null;
      this._eat('SEMICOLON');
      return {
        type: 'ReturnStatement',
        argument,
      };
    }

    IterationStatement() {
      switch(this._lookahead.type) {
        case 'WHILE':
          return this.WhileStatement();
        case 'DO':
          return this.DoWhileStatement();
        case 'FOR':
          return this.ForStatement();
      }
    }

    WhileStatement() {
      this._eat('WHILE');
      this._eat('PAREN_OPEN');
      const test = this.Expression();
      this._eat('PAREN_CLOSE');
      const body = this.Statement();
      return {
        type: 'WhileStatement',
        test,
        body,
      };
    }

    DoWhileStatement() {
      this._eat('DO');
      const body = this.Statement();
      this._eat('WHILE');
      this._eat('PAREN_OPEN');
      const test = this.Expression();
      this._eat('PAREN_CLOSE');
      this._eat('SEMICOLON');
      return {
        type: 'DoWhileStatement',
        body,
        test,
      };
    }

    ForStatement() {
      this._eat('FOR');
      this._eat('PAREN_OPEN');

      const init = this._lookahead.type !== 'SEMICOLON' ? this.ForStatementInit() : null;
      this._eat('SEMICOLON');

      const test = this._lookahead.type !== 'SEMICOLON' ? this.Expression() : null;
      this._eat('SEMICOLON');

      const update = this._lookahead.type !== 'PAREN_CLOSE' ? this.Expression() : null;
      this._eat('PAREN_CLOSE');

      const body = this.Statement();
      return {
        type: 'ForStatement',
        init,
        test,
        update,
        body,
      };
    }

    ForStatementInit() {
      if (this._lookahead.type === 'LET') {
        return this.VariableStatementInit();
      }

      return this.Expression();
    }

    IfStatement() {
      this._eat('IF');
      this._eat('PAREN_OPEN');
      const test = this.Expression();
      this._eat('PAREN_CLOSE');
      const consequent = this.Statement();
      const alternate = this._lookahead !== null && this._lookahead.type === 'ELSE' ? this._eat('ELSE') && this.Statement() : null;

      return {
        type: 'IfStatement',
        test,
        consequent,
        alternate,
      };
    }

    VariableStatementInit() {
      this._eat('LET');
      const declarations = this.VariableDeclarationList();
      return {
        type: 'VariableStatement',
        declarations,
      };
    }

    VariableStatement() {
      const variableStatement = this.VariableStatementInit();
      this._eat('SEMICOLON');
      return variableStatement;
    }

    VariableDeclarationList() {
      const declarations = [];

      do {
        declarations.push(this.VariableDeclaration());
      } while (this._lookahead.type === 'COMMA' && this._eat('COMMA'));

      return declarations;
    }

    VariableDeclaration() {
      const id = this.Identifier();

      const init = this._lookahead.type !== 'SEMICOLON' && this._lookahead.type !== 'COMMA' ? this.VariableInitializer() : null;

      return {
        type: 'VariableDeclaration',
        id,
        init,
      };
    }

    VariableInitializer() {
      this._eat('SIMPLE_ASSIGN');

      return this.AssignmentExpression();
    }

    EmptyStatement() {
      this._eat('SEMICOLON');
      return {
        type: 'EmptyStatement',
      };
    }

    BlockStatement() {
      this._eat('BRACE_OPEN');
      const body = this._lookahead.type === 'BRACE_CLOSE' ? [] : this.StatementList('BRACE_CLOSE');
      this._eat('BRACE_CLOSE');
      return {
        type: 'BlockStatement',
        body,
      };
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
      return this.AssignmentExpression();
    }

    AssignmentExpression() {
      const left = this.LogicalOrExpression();

      if (!this._isAssignmentOperator(this._lookahead.type)) {
        return left;
      }

      return {
        type: 'AssignmentExpression',
        operator: this.AssignmentOperator().value,
        left: this._checkValidAssignmentTarget(left),
        right: this.AssignmentExpression(),
      }
    }

    RelationalExpression() {
      return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
    }

    LeftHandSideExpression() {
      return this.CallMemberExpression();
    }

    CallMemberExpression() {
      const member = this.MemberExpression();

      if (this._lookahead.type === 'PAREN_OPEN') {
        return this._CallExpression(member)
      }

      return member
    }

    _CallExpression(callee) {
      let callExpression = {
        type: 'CallExpression',
        callee,
        arguments: this.Arguments()
      }

      if (this._lookahead.type === 'PAREN_OPEN') {
        callExpression = this._CallExpression(callExpression);
      }

      return callExpression;
    }

    Arguments() {
      this._eat('PAREN_OPEN');

      const argumentList = this._lookahead.type !== 'PAREN_CLOSE' ? this.ArgumentList() : [];

      this._eat('PAREN_CLOSE');

      return argumentList;
    }

    ArgumentList() {
      const argumentList = [];

      do {
        argumentList.push(this.AssignmentExpression())
      } while(this._lookahead.type === 'COMMA' && this._eat('COMMA'));

      return argumentList;
    }

    MemberExpression() {
      let object = this.PrimaryExpression();

      while (this._lookahead.type === 'DOT' || this._lookahead.type === 'SQUARE_BRACKET_OPEN') {
        if (this._lookahead.type === 'DOT') {
          this._eat('DOT');
          const property = this.Identifier();

          object = {
            type: 'MemberExpression',
            computed: false,
            object,
            property,
          }
        }

        if (this._lookahead.type === 'SQUARE_BRACKET_OPEN') {
          this._eat('SQUARE_BRACKET_OPEN');
          const property = this.Expression();

          this._eat('SQUARE_BRACKET_CLOSE');

          object = {
            type: 'MemberExpression',
            computed: true,
            object,
            property
          }
        }
      }

      return object;
    }

    Identifier() {
      const token = this._eat('IDENTIFIER');
      return {
        type: 'Identifier',
        name: token.value,
      };
    }

    _checkValidAssignmentTarget(node) {
      if (node.type === 'Identifier' || node.type === 'MemberExpression') {
        return node;
      }

      throw new SyntaxError('Invalid left-hand side in assignment expression');
    }

    _isAssignmentOperator(tokenType) {
      return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
    }

    AssignmentOperator() {
      if (this._lookahead.type === 'SIMPLE_ASSIGN') {
        return this._eat('SIMPLE_ASSIGN');
      }

      return this._eat('COMPLEX_ASSIGN');
    }

    LogicalExpression() {
      return this._BinaryExpression('EqualityExpression', 'LOGICAL_OPERATOR');
    }

    LogicalAndExpression() {
      return this._LogicalExpression('EqualityExpression', 'LOGICAL_AND');
    }

    LogicalOrExpression() {
      return this._LogicalExpression('LogicalAndExpression', 'LOGICAL_OR');
    }

    _LogicalExpression(builderName, operatorToken) {
      let left = this[builderName]();

      while(this._lookahead.type === operatorToken) {
        const operator = this._eat(operatorToken).value;
        const right = this[builderName]();
        left = {
          type: 'LogicalExpression',
          operator,
          left,
          right,
        };
      }

      return left;  
    }

    EqualityExpression() {
      return this._BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
    }

    _BinaryExpression(builderName, operatorToken) {
      let left = this[builderName]();

      while(this._lookahead.type === operatorToken) {
        const operator = this._eat(operatorToken).value;
        const right = this[builderName]();
        left = {
          type: 'BinaryExpression',
          operator,
          left,
          right,
        };
      }

      return left;
    }

    AdditiveExpression() {
      return this._BinaryExpression('MultiplicativeExpression', 'PLUS_OPERATOR');
    }

    MultiplicativeExpression() {    
      return this._BinaryExpression('UnaryExpression', 'MULTIPLY_OPERATOR');
    }

    PrimaryExpression() {
      if(this.isLiteral(this._lookahead.type)) {
        return this.Literal();
      }

      if(this._lookahead.type === 'PAREN_OPEN') {
        return this.ParenthesizedExpression();
      }

      if (this._lookahead.type === 'IDENTIFIER') {
        return this.Identifier();
      }

      return this.LeftHandSideExpression();
    }

    UnaryExpression() {
      let operator = null;

      switch(this._lookahead.type) {
        case 'PLUS_OPERATOR':
          operator = this._eat('PLUS_OPERATOR').value;
          break;
        case 'LOGICAL_NOT':
          operator = this._eat('LOGICAL_NOT').value;
          break;
      }

      if (operator !== null) {
        return {
          type: 'UnaryExpression',
          operator,
          argument: this.UnaryExpression(),
        }
      }

      return this.LeftHandSideExpression();
    }

    isLiteral(tokenType) {
      return tokenType === 'NUMBER' || tokenType === 'STRING' || tokenType === 'TRUE' || tokenType === 'FALSE' || tokenType === 'NULL';
    }

    ParenthesizedExpression() {
      this._eat('PAREN_OPEN');
      const expression = this.Expression();
      this._eat('PAREN_CLOSE');
      return expression;
    }

    Literal() {
      switch(this._lookahead.type) {
        case 'NUMBER':
          return this.NumericalLiteral();
        case 'STRING':
          return this.StringLiteral();
        case 'TRUE':
          return this.BooleanLiteral(true);
        case 'FALSE':
          return this.BooleanLiteral(false);
        case 'NULL':
          return this.NullLiteral();
      }

      throw new SyntaxError(`Literal: Unexpected literal production`);
    }

    BooleanLiteral(value) {
      this._eat(value ? 'TRUE' : 'FALSE');
      return {
        type: 'BooleanLiteral',
        value,
      };
    }

    NullLiteral() {
      this._eat('NULL');
      return {
        type: 'NullLiteral',
        value: null,
      };
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