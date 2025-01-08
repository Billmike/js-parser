const { Parser } = require('../Parser');

// Helper for colored console output
const GREEN_CHECK = '\u2714\x1b[32m';
const RESET = '\x1b[0m';

// Test suite for Parser string parsing
(() => {
  const parser = new Parser();

  // Test 1: Parse double-quoted string
  {
    const ast = parser.parse('"hello"');
    const expected = {
      type: 'Program',
      body: {
        type: 'StringLiteral',
        value: 'hello'
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse double-quoted string'
    );
    console.log(`${GREEN_CHECK} Passed: Parse double-quoted string${RESET}`);
  }

  // Test 2: Parse single-quoted string
  {
    const ast = parser.parse("'world'");
    const expected = {
      type: 'Program',
      body: {
        type: 'StringLiteral',
        value: 'world'
      }
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

(() => {
  const parser = new Parser();

  // Test 1: Parse integer
  {
    const ast = parser.parse('42');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse integer'
    );
    console.log(`${GREEN_CHECK} Passed: Parse integer${RESET}`);
  }

  // Test 2: Parse multi-digit number 
  {
    const ast = parser.parse('1234567');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 1234567
      }
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
      parser.parse('42a');
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
    const ast = parser.parse('   42');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with leading whitespace'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with leading whitespace${RESET}`);
  }

  // Test 2: Parse number with trailing whitespace
  {
    const ast = parser.parse('42   ');
    const expected = {
      type: 'Program', 
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with trailing whitespace'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with trailing whitespace${RESET}`);
  }

  // Test 3: Parse number with whitespace on both sides
  {
    const ast = parser.parse('  42  ');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
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
    const ast = parser.parse('// This is a comment\n42');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with single line comment before'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with single line comment before${RESET}`);
  }

  // Test 2: Parse number with single line comment after
  {
    const ast = parser.parse('42 // This is a comment');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with single line comment after'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with single line comment after${RESET}`);
  }

  // Test 3: Parse number with multi line comment before
  {
    const ast = parser.parse('/* This is a\nmulti line comment */42');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with multi line comment before'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with multi line comment before${RESET}`);
  }

  // Test 4: Parse number with multi line comment after
  {
    const ast = parser.parse('42/* This is a\nmulti line comment */');
    const expected = {
      type: 'Program',
      body: {
        type: 'NumericalLiteral',
        value: 42
      }
    };
    
    console.assert(
      JSON.stringify(ast) === JSON.stringify(expected),
      'Failed to parse number with multi line comment after'
    );
    console.log(`${GREEN_CHECK} Passed: Parse number with multi line comment after${RESET}`);
  }

  console.log('All comment parsing tests passed!');
})();
