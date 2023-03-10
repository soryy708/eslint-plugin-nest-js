# [ESLint](https://eslint.org/) Plugin for [Nest JS](https://nestjs.com/)

This provides custom ESLint rules for static analysis of [TypeScript](https://www.typescriptlang.org/) projects using Nest JS, targeting specifically usage of NestJS.

---

## Provided rules:

### Possible mistakes (recommended):

#### Stable:

- (none)

#### Experimental:

- `injectable-providers`
  > Classes given `@Module`s in their `providers` array must be decorated with `@Injectable`.
- `no-imports-injectable`
  > Classes given `@Module`s in their `imports` array must not be `@Injectable`s.

Please don't use Experimental rules. They're works in progress, and are guaranteed to not work properly.

### Style

#### Stable:

- `no-forward-ref`
  > Don't use forwardRef, because it smells like circular dependencies.
- `no-multi-export`
  > Don't export more than one provider, because it violates the Interface Segregation Principle.

#### Experimental:

- (none)

---

## Open Source policy

Pull requests are welcome.

In case of disagreement, feel free to fork, and may the best fork survive :)

In case of a new rule, please follow [ESLint core rules naming conventions](https://eslint.org/docs/latest/contribute/core-rules#rule-naming-conventions):

> - Use dashes between words.
> - If your rule only disallows something, prefix it with `no-`, such as `no-eval` for disallowing `eval()` and `no-debugger` for disallowing `debugger`.
> - If your rule is enforcing the inclusion of something, use a short name without a special prefix.
