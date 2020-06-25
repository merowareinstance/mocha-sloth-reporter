const chalk = require("chalk");
const core = require("@actions/core");

const config = {
  highSeverityThreshold: 150, // ms
  mediumServerityTheshold: 75, // ms
  actionsEnabled: false,
  inlineEnabled: false,
};

const slothyTests = [];

function testCompleted(duration, title) {
  if (duration > config.mediumServerityTheshold) {
    const isServere = duration > config.highSeverityThreshold;
    const currentTest = {
      title,
      duration,
      actionDisplay: isServere ? core.error : core.warning,
      colorDisplay: isServere ? chalk.red : chalk.yellow,
    };
    slothyTests.push(currentTest);
    return currentTest;
  }
  return null;
}

function printTest(test) {
  console.log(test.colorDisplay(`${test.duration} ms`), test.title);
  if (config.actionsEnabled) {
    test.actionDisplay(`${test.duration} ms: ${test.title}`);
  }
}

function completed() {
  if (config.inlineEnabled) {
    console.log("");
  }
  console.log(chalk.bold("Slothy Test Count: %s\n"), slothyTests.length);

  if (slothyTests.length === 0) {
    return;
  }

  if (!config.inlineEnabled) {
    const sortSlothyTests = slothyTests.sort((a, b) => {
      return b.duration - a.duration;
    });

    sortSlothyTests.forEach((test) => {
      printTest(test);
    });

    console.log("");
  }

  setTimeout(() => {
    process.exit();
  }, 0);
}

function testRunner(runner, options) {
  const { reporterOptions } = options;

  let { actions, slow, inline } = options;

  actions = actions || options["reporterOptions.actions"];
  slow = slow || options["reporterOptions.slow"];
  inline = inline || options["reporterOptions.inline"];

  if (reporterOptions) {
    actions = actions || reporterOptions.actions;
    slow = slow || reporterOptions.slow;
    inline = inline || reporterOptions.inline;
  }

  const slowNum = Number(slow);
  if (slow && Number.isInteger(slowNum)) {
    config.mediumServerityTheshold = slowNum;
    config.highSeverityThreshold = slowNum * 2;
  } else if (slow !== undefined) {
    throw new Error("Slow variable needs to be an integer");
  }

  if (
    actions === "true" ||
    actions === "false" ||
    actions === true ||
    actions === false
  ) {
    config.actionsEnabled = actions === "true" || actions === true;
  } else if (actions !== undefined) {
    throw new Error("Actions needs to be a boolean true/false");
  }

  if (
    inline === "true" ||
    inline === "false" ||
    inline === true ||
    inline === false
  ) {
    config.inlineEnabled = inline === "true" || inline === true;
  } else if (inline !== undefined) {
    throw new Error("Inline needs to be a boolean true/false");
  }

  runner.on("test end", (test) => {
    try {
      const currentTest = testCompleted(test.duration, test.fullTitle());
      if (currentTest && config.inlineEnabled) {
        printTest(currentTest);
      }
    } catch (e) {
      console.log(e);
      if (config.actionsEnabled) {
        core.setFailed(e.message);
      }
    }
  });

  runner.on("end", () => {
    try {
      completed();
    } catch (e) {
      console.log(e);
      if (config.actionsEnabled) {
        core.setFailed(e.message);
      }
    }
  });
}

module.exports = testRunner;
