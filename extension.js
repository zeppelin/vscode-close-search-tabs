const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'close-search-tabs.main',
    function () {
      let { tabGroups } = vscode.window;
      let tabs = tabGroups.activeTabGroup.tabs.filter(
        // Search tabs are restored with the title "Search" when vscode reopens. They'll get back
        // their original title after focused.
        (tab) => tab.label.startsWith('Search: ') || tab.label === 'Search'
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
