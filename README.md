# Workbench Client

The Angular 8 client for an acoustic workbench application.

[![Build Status](https://dev.azure.com/QutEcoacoustics/acoustic-workbench/_apis/build/status/QutEcoacoustics.workbench-client?branchName=master)](https://dev.azure.com/QutEcoacoustics/acoustic-workbench/_build/latest?definitionId=4&branchName=master)

## Install instructions

### Requirements

- Node v12.8.0 or greater
- NPM v6.10.0 or greater
- Google Chrome
- Mozilla Firefox

### Installation

To install project dependencies run:

```bash
$ npm install
```

## To develop:

```bash
$ npm start
```

Then open a web browser to `localhost:4200`.

### Access the ng tool

```bash
$ npx ng
```

or

```
npm run ng
```

### Documentation

This project implements the compodoc documentation tool. To generate the documentation for yourself, run the following command:

```javascript
npm run documentation:generate
```

This will create a `./documentation` folder containing the generated documentation. To view this in your web browser, run the following command:

```javascript
npm run documentation
```

### Testing

#### End to End Testing

To run the application end to end test suite:

```bash
$ npm run e2e
```

This will run the entire test suite in both Mozilla Firefox and Google Chrome browsers. End to end tests are used to determine if an application is working across multiple user actions over multiple pages.

#### Unit tests

To run the application unit test suite:

```bash
$ npm test
```

This will run the entire test suite in both Mozilla Firefox and Google Chrome browsers. Unit tests are used to determine if singular segments of the application are functioning correctly.

#### Code Coverage

On the completion of the unit tests, the system will automatically generate a code coverage report. To open this, run the following command:

```bash
$ npm run code-coverage
```

## To build

To build the application in production mode:

```bash
$ npm run build
```

Move the generated files from the `/dist` directory to the required location.

### Environments

There are three environments supported by this application.

- Development: Building the application with debugging tools
  - `$ npm run build:dev`
- Staging: Building the latest changes in production mode for testing before release
  - `$ npm run build:staging`
- Production: Building the latest changes in production mode for release
  - `$ npm run build`

## Common Problems

Check our Wiki pages for help with common problems and using systems custom to our application.

## Licence

Apache License, Version 2.0
