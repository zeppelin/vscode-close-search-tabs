// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('close-search-tabs.main', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		let { tabGroups } = vscode.window;
		let tabs = tabGroups.activeTabGroup.tabs.filter(tab => tab.label.startsWith('Search'));

		for (let tab of tabs) {
			tabGroups.close(tab);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
