const { Parser } = require('../Parser');

// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

(() => {
  {
    const parser = new Parser();
  const ast = parser.parse('let x = 42;');
  const expected = {
    type: 'Program',
    body: [{ type: 'VariableDeclaration', declarations: [{ type: 'VariableDeclarator', id: { type: 'Identifier', name: 'x' }, init: { type: 'NumericLiteral', value: 42 } }] }]
  };
  console.assert(
    JSON.stringify(ast) === JSON.stringify(expected),
    'Failed to parse variable declaration'
    );
    console.log(`${GREEN_CHECK} Passed: Variable declaration${RESET}`);
  }

  // Test 2: Parse variable declaration with multiple variables
  {
    const parser = new Parser();
    const ast = parser.parse('let x = 42, y = 43;');
    const expected = {
      type: 'Program',
      body: [{ type: 'VariableDeclaration', declarations: [{ type: 'VariableDeclarator', id: { type: 'Identifier', name: 'x' }, init: { type: 'NumericLiteral', value: 42 } }, { type: 'VariableDeclarator', id: { type: 'Identifier', name: 'y' }, init: { type: 'NumericLiteral', value: 43 } }] }]
    };  
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse variable declaration with multiple variables'
    );
    console.log(`${GREEN_CHECK} Passed: Variable declaration with multiple variables${RESET}`);
  }

  // Multiple declarations no init
  {
    const parser = new Parser();
    const ast = parser.parse('let x, y;');
    const expected = {
      type: 'Program',
      body: [{ type: 'VariableDeclaration', declarations: [{ type: 'VariableDeclarator', id: { type: 'Identifier', name: 'x' }, init: null }, { type: 'VariableDeclarator', id: { type: 'Identifier', name: 'y' }, init: null }] }]
    };
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse variable declaration with multiple variables'
    );
    console.log(`${GREEN_CHECK} Passed: Variable declaration with multiple variables${RESET}`);
  }

  // Multiple declarations with init
  {
    const parser = new Parser();
    const ast = parser.parse('let x, y = 43;');
    const expected = {
      type: 'Program',
      body: [{ type: 'VariableDeclaration', declarations: [{ type: 'VariableDeclarator', id: { type: 'Identifier', name: 'x' }, init: null }, { type: 'VariableDeclarator', id: { type: 'Identifier', name: 'y' }, init: { type: 'NumericLiteral', value: 43 } }] }]
    };
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse variable declaration with multiple variables'
    );
    console.log(`${GREEN_CHECK} Passed: Variable declaration with multiple variables${RESET}`);
  }
})();
