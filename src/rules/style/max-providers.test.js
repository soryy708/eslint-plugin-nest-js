const RuleTester = require('eslint').RuleTester;
const rule = require('./max-providers');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'max-providers';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Module} from '@nestjs/common'; @Module({}) class MyModule {}",
        options: [1],
      },
      {
        code: "import {Module} from '@nestjs/common'; @Module({providers: []}) class MyModule {}",
        options: [1],
      },
      {
        code: "import {Module} from '@nestjs/common'; import {Service1} from '../../testing/injectable'; @Module({providers: [Service1]}) class MyModule {}",
        options: [1],
      },
      {
        code: "import {Module} from '@nestjs/common'; import {Service1, Service2} from '../../testing/injectable'; @Module({providers: [Service1, Service2]}) class MyModule {}",
        options: [2],
      },
    ],
    invalid: [
      {
        code: "import {Module} from '@nestjs/common'; import {Service1, Service2} from '../../testing/injectable'; @Module({providers: [Service1, Service2]}) class MyModule {}",
        options: [1],
        errors: [
          {
            messageId: 'exceed',
            data: {
              name: 'MyModule',
              count: 2,
              max: 1,
            },
          },
        ],
      },
      {
        code: "import {Module} from '@nestjs/common'; import {Service1, Service2, Service3} from '../../testing/injectable'; @Module({providers: [Service1, Service2, Service3]}) class MyModule {}",
        options: [2],
        errors: [
          {
            messageId: 'exceed',
            data: {
              name: 'MyModule',
              count: 3,
              max: 2,
            },
          },
        ],
      },
    ],
  });
});
