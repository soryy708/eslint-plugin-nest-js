const path = require('path');
const RuleTester = require('eslint').RuleTester;
const rule = require('./no-imports-injectable');
const supportedParsers = require('../../policy/supported-parsers');

const ruleName = 'no-imports-injectable';

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
        code: "import {Module} from '@nestjs/common'; @Module({}) class Imported {} @Module({imports: [Imported]}) class MyModule {}",
        filename: __filename,
      },
      {
        code: "import {Service} from '../../testing/not-injectable'; import {Module} from '@nestjs/common'; @Module({imports: [Service]}) class MyModule {}",
        filename: __filename,
      },
    ],
    invalid: [
      {
        code: "import {Injectable, Module} from '@nestjs/common'; @Injectable() class Imported {} @Module({imports: [Imported]}) class MyModule {}",
        filename: __filename,
        errors: [{ message: 'Imported is an `@Injectable`' }],
      },
      {
        code: "import {Service} from '../../testing/injectable'; import {Module} from '@nestjs/common'; @Module({imports: [Service]}) class MyModule {}",
        filename: __filename,
        errors: [{ message: 'Imported is an `@Injectable`' }],
      },
    ],
  });
});
