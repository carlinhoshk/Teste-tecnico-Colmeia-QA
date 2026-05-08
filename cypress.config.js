const { defineConfig } = require("cypress");

module.exports = defineConfig({
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: 'https://teste-colmeia-qa.colmeia-corp.com',
  },
});
