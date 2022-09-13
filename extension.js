const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'close-search-tabs.main',
    function () {
      let { tabGroups } = vscode.window;
      let tabs = tabGroups.activeTabGroup.tabs.filter((tab) =>
        tab.label.startsWith('Search')
      );

      for (let tab of tabs) {
        tabGroups.close(tab);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
