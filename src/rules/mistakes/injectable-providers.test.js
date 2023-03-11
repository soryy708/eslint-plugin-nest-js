const path = require('path');
const RuleTester = require('eslint').RuleTester;
const rule = require('./injectable-providers');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'injectable-providers';

describe.each(supportedParsers)('When using "%s" parser', (parser) => {
  const ruleTester = new RuleTester({
    parser: require.resolve(parser),
    parserOptions: {
      project: path.resolve(
        __dirname,
        '..',
        '..',
        'testing',
        'tsconfig.fixture.json'
      ),
    },
  });

  ruleTester.run(ruleName, rule[ruleName], {
    valid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Service {} @Module({providers: [Service]}) class MyModule {}",
        filename: __filename,
      },
      {
        code: "import {Service} from '../../testing/injectable'; import {Module} from '@nestjs/common'; @Module({providers: [Service]}) class MyModule {}",
        filename: __filename,
      },
    ],
    invalid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; class Service {} @Module({providers: [Service]}) class MyModule {}",
        filename: __filename,
        errors: [{ message: 'Provider is not `@Injectable`' }],
      },
      {
        code: "import {Service} from '../../testing/not-injectable'; import {Module} from '@nestjs/common'; @Module({providers: [Service]}) class MyModule {}",
        filename: __filename,
        errors: [{ message: 'Provider is not `@Injectable`' }],
      },
    ],
  });
});
