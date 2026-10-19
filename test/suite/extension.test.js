const assert = require('assert');
const path = require('path');

const vscode = require('vscode');

const { isSearchTab } = require('../../extension');

const COMMAND = 'close-search-tabs.main';

function workspaceFile(name) {
  let [folder] = vscode.workspace.workspaceFolders;
  return vscode.Uri.file(path.join(folder.uri.fsPath, name));
}

/**
 * Polls until `predicate` returns true, since the tab model updates asynchronously.
 */
async function waitFor(predicate, message, timeout = 3000) {
  let start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) {
      throw new Error(`Timed out waiting for: ${message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

function labels(group = vscode.window.tabGroups.activeTabGroup) {
  return group.tabs.map((tab) => tab.label);
}

async function openSearchEditor(query) {
  let label = `Search: ${query}`;
  await vscode.commands.executeCommand('search.action.openNewEditor', {
    query,
    triggerSearch: false,
  });
  await waitFor(() => labels().includes(label), `tab "${label}"`);
}

async function openFile(name, viewColumn = vscode.ViewColumn.Active) {
  let document = await vscode.workspace.openTextDocument(workspaceFile(name));
  await vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn,
  });
}

suite('isSearchTab', () => {
  let tab = (label) => ({ label });

  test('matches search editor labels', () => {
    assert.ok(isSearchTab(tab('Search: foo')));
    assert.ok(isSearchTab(tab('Search: ')));
    assert.ok(isSearchTab(tab('Search: foo bar: baz')));
  });

  test('matches the bare "Search" label of restored search editors', () => {
    assert.ok(isSearchTab(tab('Search')));
  });

  test('does not match other labels', () => {
    assert.ok(!isSearchTab(tab('a.txt')));
    assert.ok(!isSearchTab(tab('search: foo')));
    assert.ok(!isSearchTab(tab('Search:foo')));
    assert.ok(!isSearchTab(tab('Searching.md')));
    assert.ok(!isSearchTab(tab('Search results')));
    assert.ok(!isSearchTab(tab('My Search: foo')));
    assert.ok(!isSearchTab(tab('')));
  });

  test('does not match text files named like a search editor', () => {
    let fileTab = (label) => ({
      label,
      input: new vscode.TabInputText(workspaceFile(label)),
    });

    assert.ok(!isSearchTab(fileTab('Search')));
    assert.ok(!isSearchTab(fileTab('Search: foo')));
  });
});

suite('close-search-tabs.main', function () {
  this.timeout(10000);

  setup(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  teardown(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await vscode.commands.executeCommand('workbench.action.editorLayoutSingle');
  });

  test('is contributed and activates the extension on demand', async () => {
    let { activationEvents, contributes } = require('../../package.json');
    assert.ok(activationEvents.includes(`onCommand:${COMMAND}`));
    assert.ok(contributes.commands.some(({ command }) => command === COMMAND));

    await vscode.commands.executeCommand(COMMAND);

    let commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes(COMMAND));
  });

  test('closes a search editor tab', async () => {
    await openSearchEditor('hello');
    assert.deepStrictEqual(labels(), ['Search: hello']);

    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(), []);
  });

  test('closes every search editor and keeps other tabs', async () => {
    await openFile('a.txt');
    await openSearchEditor('hello');
    await openFile('b.txt');
    await openSearchEditor('world');
    assert.deepStrictEqual(labels(), [
      'a.txt',
      'Search: hello',
      'b.txt',
      'Search: world',
    ]);

    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(), ['a.txt', 'b.txt']);
  });

  test('does nothing when there are no search editors', async () => {
    await openFile('a.txt');
    await openFile('b.txt');

    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(), ['a.txt', 'b.txt']);
  });

  test('keeps a text file named "Search"', async () => {
    await openFile('Search');
    await openSearchEditor('hello');
    assert.deepStrictEqual(labels(), ['Search', 'Search: hello']);

    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(), ['Search']);
  });

  test('does nothing when there are no tabs at all', async () => {
    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(), []);
  });

  test('only closes search editors in the active editor group', async () => {
    await openSearchEditor('first');
    await openFile('a.txt', vscode.ViewColumn.Two);
    await openSearchEditor('second');

    let [first, second] = vscode.window.tabGroups.all;
    assert.strictEqual(vscode.window.tabGroups.activeTabGroup, second);
    assert.deepStrictEqual(labels(first), ['Search: first']);
    assert.deepStrictEqual(labels(second), ['a.txt', 'Search: second']);

    await vscode.commands.executeCommand(COMMAND);

    assert.deepStrictEqual(labels(first), ['Search: first']);
    assert.deepStrictEqual(labels(second), ['a.txt']);
  });
});
