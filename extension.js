const vscode = require('vscode');

/**
 * Search tabs are restored with the title "Search" when vscode reopens. They'll get back their
 * original title after focused.
 *
 * Search editors don't expose a tab input, so this also rules out regular files that merely
 * happen to be named like one (e.g. a file called "Search").
 *
 * @param {vscode.Tab} tab
 */
function isSearchTab(tab) {
  if (tab.input instanceof vscode.TabInputText) {
    return false;
  }

  return tab.label.startsWith('Search: ') || tab.label === 'Search';
}

function closeSearchTabs() {
  let { tabGroups } = vscode.window;
  let tabs = tabGroups.activeTabGroup.tabs.filter(isSearchTab);

  return tabGroups.close(tabs);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'close-search-tabs.main',
    closeSearchTabs
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  isSearchTab,
};
