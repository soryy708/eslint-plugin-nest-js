const RuleTester = require('eslint').RuleTester;
const rule = require('./injectable-providers');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'injectable-providers';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Service {} @Module({providers: [Service]}) class MyModule {}",
      },
    ],
    invalid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; class Service {} @Module({providers: [Service]}) class MyModule {}",
        errors: [{ message: 'Provider is not `@Injectable`' }],
      },
    ],
  });
});
