const RuleTester = require('eslint').RuleTester;
const rule = require('./no-imports-injectable');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'no-imports-injectable';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Module} from '@nestjs/common'; @Module({}) class Imported {} @Module({imports: [Imported]}) class MyModule {}",
      },
    ],
    invalid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Imported {} @Module({imports: [Imported]}) class MyModule {}",
        errors: [{ message: 'Imported is an `@Injectable`' }],
      },
    ],
  });
});
