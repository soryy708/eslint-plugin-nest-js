const RuleTester = require('eslint').RuleTester;
const rule = require('./no-forward-ref');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'no-forward-ref';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Module} from '@nestjs/common'; @Module({}) class Module1 {} @Module({imports: [Module1]}) class Module2 {}",
      },
    ],
    invalid: [
      {
        code: "import {Module, forwardRef} from '@nestjs/common'; @Module({}) class Module1 {} @Module({imports: [forwardRef(() => Module1)]}) class Module2 {}",
        errors: [{ message: "Don't use `forwardRef`" }],
      },
    ],
  });
});
