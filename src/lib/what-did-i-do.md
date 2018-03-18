# jscodeshift
## Why?
Because `yarn build` wouldn't work as `jscodeshift` npm module isn't ES5-compatible.

## What did I change?
- `src/getParser.js`: set `flow` as default parser
- `parser/flow.js`: now require `flow-parser` using electron parent process
