const path = require('path');

class ESLint {
  static version = '8.0.0';
  constructor(options = {}) {
    this.options = options;
  }
  async lintFiles(lintTargets = []) {
    return lintTargets.map((target) => ({
      filePath: path.resolve(target),
      messages: [],
      suppressedMessages: [],
      fatalErrorCount: 0,
      errorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: []
    }));
  }
  async calculateConfigForFile() {
    return { plugins: [], rules: {} };
  }
  async loadFormatter() {
    return { format: () => '' };
  }
  static async outputFixes() {}
  static getErrorResults() {
    return [];
  }
}
module.exports = { ESLint, CLIEngine: { version: '8.0.0' } };
