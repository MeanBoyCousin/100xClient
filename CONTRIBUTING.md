# Contributing to the 100x Client SDK

Thank you for your interest in contributing to the 100x Client SDK. This document outlines the guidelines for contributing code and documentation to this project. Here are guidelines to assist you as you prepare your contribution.

## Setting up the project

The following steps will help you to get up and running locally so you can begin contributing.

1. Begin by forking this repository.
2. Clone your fork locally.
3. Setup all the dependencies by running `yarn install`.

## Development

We're all about the developer experience at 100x, so this project has been setup with simple tooling and systems so you can start building as quick as possible.

## Tooling

- We use the [Yarn](https://yarnpkg.com/) package manager.
- Bundling is done using [Tsup](https://tsup.egoist.dev/).
- We use [Vitest](https://vitest.dev/) to run unit and integration tests.
- We also use [Stryker](https://stryker-mutator.io/docs/stryker-js/introduction/) for mutation testing to add an extra level of confidence.
- Finally, we make use of [Lint staged](https://github.com/lint-staged/lint-staged) to ensure code quality when commits are made.

## Commands

- `yarn build`: Builds the package.
- `yarn dev`: Starts tsup in watch mode to ensure your changes will compile correctly.
- `yarn sandbox`: Uses tsx to run a file located at `src/sandbox.ts`. This file is not checked in and so must be created manually. It is useful for testing your changes in a real world scenario.
- `yarn test`: Runs all unit and integration tests.
- `yarn test:cov`: Runs all unit and integration tests with a coverage report.
- `yarn test:mutations`: Runs mutation tests based on our unit and integration tests for added confidence. This can take a long time to run depending on your machine specs.

## Making a PR

1. Implement your changes to the code base. This also means adding new tests to ensure coverage for any new features or changes that you have made. We also expect JSDocs to be implemented for any new features. You can refer to the existing codebase for guidance on how to apply these.

2. Before opening a PR, please ensure that your changes build successfully and that your tests are passing locally. We strive to ensure as close to 100% test coverage as possible.

3. Ensure that as part of your PR, you have changed the version number appropriately and added a new entry to the change log. This package follows [semver](https://semver.org/) so please refer to this for guidance if you are unsure on what version change to apply.

## License

By contributing your code to the GitHub repository, you agree to license your contribution under the MIT license.
