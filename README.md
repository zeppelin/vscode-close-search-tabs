# Close Search Tabs

Closes all [search editor](https://code.visualstudio.com/docs/editor/codebasics#_search-editor)
tabs in one go 😱

Search editors pile up quickly: every `Search: …` tab stays open until you close it by hand. This
extension adds a single command that closes all of them, leaving your other tabs untouched.

## Usage

Open the Command Palette (`⇧⌘P` on macOS, `Ctrl+Shift+P` on Windows/Linux) and run
**Close Search Tabs**.

It closes every search editor in the **active editor group**, including search editors restored
from a previous session, which VS Code labels just `Search` until they are focused. Regular
files are never closed, even if they happen to be named `Search`.

### Keyboard shortcut

The extension doesn't bind a shortcut by default. To add one, open **Preferences: Open Keyboard
Shortcuts (JSON)** and add:

```json
{
  "key": "ctrl+alt+w",
  "command": "close-search-tabs.main"
}
```

## Development

```sh
pnpm install
pnpm test               # lints, then runs the tests inside a downloaded VS Code
pnpm run vsce:package   # builds a .vsix
pnpm run vsce:publish   # publishes to the Marketplace (requires `pnpm exec vsce login zeppelin`)
```

## License

[MIT](LICENSE.txt)
