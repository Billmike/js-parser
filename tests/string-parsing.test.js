const { Parser } = require('../Parser');

// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';


(() => {
  const parser = new Parser();

  // Test 1: Parse double-quoted string
  {
    const ast = parser.parse('"hello";');
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'hello'
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse double-quoted string'
    );
    console.log(`${GREEN_CHECK} Passed: Parse double-quoted string${RESET}`);
  }

  // Test 2: Parse single-quoted string
  {
    const ast = parser.parse("'world';");
    const expected = {
      type: 'Program',
      body: [{
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'world'
        }
      }]
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse single-quoted string'
    );
    console.log(`${GREEN_CHECK} Passed: Parse single-quoted string${RESET}`);
  }

  // Test 3: Invalid string should throw
  {
    let threw = false;
    try {
      parser.parse('"unclosed');
    } catch (e) {
      threw = e instanceof SyntaxError;
    }
    console.assert(threw, 'Failed to throw on invalid string');
    console.log(`${GREEN_CHECK} Passed: Invalid string throws error${RESET}`);
  }

  console.log('All string parsing tests passed!');
})();