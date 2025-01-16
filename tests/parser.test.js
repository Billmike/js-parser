require('./string-parsing.test');
require('./assignment.test');

const { Parser } = require('../Parser');


// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

(() => {
  const parser = new Parser();

  // Test 1: Parse integer
  {
    const ast = parser.parse('42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse integer'
    );
    console.log(`${GREEN_CHECK} Passed: Parse integer${RESET}`);
  }

  // Test 2: Parse multi-digit number 
  {
    const ast = parser.parse('1234567;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 1234567
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse multi-digit number'
    );
    console.log(`${GREEN_CHECK} Passed: Parse multi-digit number${RESET}`);
  }

  // Test 3: Invalid number should throw
  {
    let threw = false;
    try {
      parser.parse('42a;');
    } catch (e) {
      threw = e instanceof SyntaxError;
    }
    console.assert(threw, 'Failed to throw on invalid number');
    console.log(`${GREEN_CHECK} Passed: Invalid number throws error${RESET}`);
  }

  console.log('All number parsing tests passed!');
})();

(() => {
  const parser = new Parser();

  // Test 1: Parse number with leading whitespace
  {
    const ast = parser.parse('   42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with leading whitespace'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with leading whitespace${RESET}`);
  }

  // Test 2: Parse number with trailing whitespace
  {
    const ast = parser.parse('42   ;');
    const expected = {
      type: 'Program', 
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with trailing whitespace'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with trailing whitespace${RESET}`);
  }

  // Test 3: Parse number with whitespace on both sides
  {
    const ast = parser.parse('  42  ;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with whitespace on both sides'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with whitespace on both sides${RESET}`);
  }

  console.log('All whitespace parsing tests passed!');
})();

// Single line and multi line comment tests
(() => {
  const parser = new Parser();

  // Test 1: Parse number with single line comment before
  {
    const ast = parser.parse('// This is a comment\n42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with single line comment before'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with single line comment before${RESET}`);
  }

  // Test 2: Parse number with single line comment after
  {
    const ast = parser.parse('42; // This is a comment');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with single line comment after'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with single line comment after${RESET}`);
  }

  // Test 3: Parse number with multi line comment before
  {
    const ast = parser.parse('/* This is a\nmulti line comment */42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with multi line comment before'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with multi line comment before${RESET}`);
  }

  // Test 4: Parse number with multi line comment after
  {
    const ast = parser.parse('42;/* This is a\nmulti line comment */');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'NumericalLiteral',
          value: 42
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with multi line comment after'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with multi line comment after${RESET}`);
  }

  console.log('All comment parsing tests passed!');
})();

// Test multiple expressions
(() => {
  const parser = new Parser();

  // Test: Parse multiple expressions
  {
    const ast = parser.parse('42; "hello";');
    const expected = {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'NumericalLiteral',
            value: 42
          }
        },
        {
          type: 'ExpressionStatement', 
          expression: {
            type: 'StringLiteral',
            value: 'hello'
          }
        }
      ]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse multiple expressions'
    );
    console.log(`${GREEN_CHECK} Passed: Parse multiple expressions${RESET}`);
  }

  console.log('Multiple expressions test passed!');
})();

// Test block statements and empty statements
(() => {
  const parser = new Parser();

  // Test: Empty block statement
  {
    const ast = parser.parse('{}');
    const expected = {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: []
        }
      ]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse empty block statement'
    );
    console.log(`${GREEN_CHECK} Passed: Parse empty block statement${RESET}`);
  }

  // Test: Empty statement
  {
    const ast = parser.parse(';');
    const expected = {
      type: 'Program',
      body: [
        {
          type: 'EmptyStatement'
        }
      ]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse empty statement'
    );
    console.log(`${GREEN_CHECK} Passed: Parse empty statement${RESET}`);
  }

  // Test: Block statement with expressions
  {
    const ast = parser.parse('{ 42; "hello"; }');
    const expected = {
      type: 'Program', 
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericalLiteral',
                value: 42
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: 'hello'
              }
            }
          ]
        }
      ]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse block statement with expressions'
    );
    console.log(`${GREEN_CHECK} Passed: Parse block statement with expressions${RESET}`);
  }

  // Test: Nested block statements
  {
    const ast = parser.parse('{ { 42; }; { "hello"; }; }');
    const expected = {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'NumericalLiteral',
                    value: 42
                  }
                }
              ]
            },
            {
              type: 'BlockStatement', 
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse nested block statements'
    );
    console.log(`${GREEN_CHECK} Passed: Parse nested block statements${RESET}`);
  }

  console.log('Block statement and empty statement tests passed!');
})();

// Test binary expressions
(() => {
  const parser = new Parser();

  // Test: Parse binary expression
  {
    const ast = parser.parse('42 + 1;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'NumericalLiteral', value: 42 },
          right: { type: 'NumericalLiteral', value: 1 }
        }
      }]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse binary expression'
    );
    console.log(`${GREEN_CHECK} Passed: Parse binary expression${RESET}`);
  }

  // Test: Nested binary expressions
  {
    const ast = parser.parse('42 + 1 + 2;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'BinaryExpression',
            operator: '+',
            left: { type: 'NumericalLiteral', value: 42 },
            right: { type: 'NumericalLiteral', value: 1 }
          },
          right: { type: 'NumericalLiteral', value: 2 }
        }
      }]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse nested binary expressions'
    );
    console.log(`${GREEN_CHECK} Passed: Parse nested binary expressions${RESET}`);
  }

  // Test: Multiplicative expression
  {
    const ast = parser.parse('42 * 1;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '*',
          left: { type: 'NumericalLiteral', value: 42 },
          right: { type: 'NumericalLiteral', value: 1 }
        }
      }]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse multiplicative expression'
    );
    console.log(`${GREEN_CHECK} Passed: Parse multiplicative expression${RESET}`);
  }

  // Test: Parenthesized expression
  {
    const ast = parser.parse('(42);');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: { type: 'NumericalLiteral', value: 42 }
      }]
    };

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse parenthesized expression'
    );
    console.log(`${GREEN_CHECK} Passed: Parse parenthesized expression${RESET}`);
  }

  console.log('Binary expression tests passed!');
})();


function exec() {
  const program = `
  // This is a comment
  /* This is a multi line comment */
  // This is a comment
  /* This is a multi line comment */
  // This is a comment
  /* This is a multi line comment */

  "hello";

  a = b = c = 42;`

  const parser = new Parser();
  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}

exec();