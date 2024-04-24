module.exports = {
    rootDir: "../src",
    testMatch: ["**/*.e2e-spec.ts"],
    testRegex: ".*\\.e2e-spec\\.ts$",
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json", "ts"],
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
      },
  };
  