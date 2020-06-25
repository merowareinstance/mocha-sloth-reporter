/* eslint-disable no-undef */
const { assert } = require("chai");

describe("Slothy Suite", () => {
  it("Such A Slothy Test", (done) => {
    assert.isFalse(false);
    setTimeout(done, 1000);
  });
});
