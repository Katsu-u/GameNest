const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");

test("the express app is created", () => {
  assert.equal(typeof app, "function");
});
