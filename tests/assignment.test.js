const { Parser } = require('../Parser');

// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

// Test: Simple assignment
(() => {
  const parser = new Parser();

  {
    const ast = parser.parse('x = 42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'x'
          },
          right: {
            type: 'NumericLiteral',
            value: 42
          }
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse simple assignment'
    );
    console.log(`${GREEN_CHECK} Passed: Simple assignment${RESET}`);
  }

  // Chained assignment
  {
    const ast = parser.parse('a = b = 42;');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: { type: 'Identifier', name: 'a' },
          right: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: 'b'
            },
            right: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'c'
              },
              right: {
                type: 'NumericLiteral',
                value: 42
              }
            }
          }
        }
      }]
    }

    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse chained assignment'
    );
    console.log(`${GREEN_CHECK} Passed: Chained assignment${RESET}`);
  }

  console.log('All assignment tests passed!');
})();