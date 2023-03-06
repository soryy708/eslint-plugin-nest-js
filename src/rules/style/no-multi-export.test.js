const RuleTester = require('eslint').RuleTester;
const rule = require('./no-multi-export');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'no-multi-export';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Service {} @Module({providers: [Service], exports: [Service]}) class MyModule {}",
      },
    ],
    invalid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Service1 {} @Injectable() class Service2 {} @Module({providers: [Service1, Service2], exports: [Service1, Service2]}) class MyModule {}",
        errors: [{ message: "Don't export more than one provider" }],
      },
    ],
  });
});
