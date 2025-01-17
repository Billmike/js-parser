const { Parser } = require('../Parser');


// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

(() => {
  const parser = new Parser();

  const ast = parser.parse('x > 0;');

  const expected = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'BinaryExpression',
        operator: '>',
        left: { type: 'Identifier', name: 'x' },
        right: { type: 'NumericLiteral', value: 0 }
      }
    }]
  };

  console.assert(
    JSON.stringify(ast) === JSON.stringify(expected),
    'Failed to parse relational expression'
  );
  console.log(`${GREEN_CHECK} Passed: Relational expression${RESET}`);
})();