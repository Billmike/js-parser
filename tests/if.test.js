const { Parser } = require('../Parser');


// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

(() => {
  const parser = new Parser();

  const ast = parser.parse('if (x) { x = 1; } else { x = 2; }');
  const expected = {
    type: 'Program',
    body: [{
      type: 'IfStatement',
      test: { type: 'Identifier', name: 'x' },
      consequent: { type: 'BlockStatement', body: [{ type: 'ExpressionStatement', expression: { type: 'AssignmentExpression', operator: '=', left: { type: 'Identifier', name: 'x' }, right: { type: 'NumericLiteral', value: 1 } } }] },
      alternate: { type: 'BlockStatement', body: [{ type: 'ExpressionStatement', expression: { type: 'AssignmentExpression', operator: '=', left: { type: 'Identifier', name: 'x' }, right: { type: 'NumericLiteral', value: 2 } } }] }
    }]
  };

  console.assert(
    JSON.stringify(ast) === JSON.stringify(expected),
    'Failed to parse if statement'
  );
  console.log(`${GREEN_CHECK} Passed: If statement${RESET}`);
})();
