# Overview

concurrencyLimiter() is an async function that takes 3 arguments:

1. An array of values to iterate over
2. An async callback that should be called with each item in the array
3. Optional max concurrency of callbacks that should be resolved at a time

- input: `map([1, 2, 3], async val => val + 1, { concurrency: 2 })`
- output: [2, 3, 4]
