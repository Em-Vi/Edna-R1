# Edna-V1 - VS Code Extension

Edna-V1 is a powerful VS Code extension designed to enhance your development workflow. This README provides an overview of its features, installation, and usage.

## Features

- Powered by deepseek-r1 1.5b model
- provides a dynamic UI to chat with model
- **Advanced thinking capabilities**

## Installation

### Requirements

Ensure the following dependencies are installed:

- **Node.js & npm**: Download from [Node.js](https://nodejs.org/)
- **VS Code**: Install from [Visual Studio Code](https://code.visualstudio.com/)

### Installing the Extension

1. Open a terminal in the extension directory.
2. Run the following command to package the extension:
   ```sh
   vsce package
   ```
   or you have troublw with it, use npx
   ```sh
   npx vsce package
   ```
   
4. Install the extension in VS Code:
   ```sh
   code --install-extension edna-v1.vsix
   ```
5. Restart VS Code and activate the extension.

## Usage

- Open a new VS Code window and activate Edna-V1 from the command palette (`Ctrl+Shift+P`).
- Configure settings via `File > Preferences > Settings`.

## Extension Settings

This extension provides the following configurable settings:

- `edna-v1.enable`: Enable/disable the extension.
- `edna-v1.option`: Customizable option for user preferences.

## Release Notes

### v1.0.0

- Initial release with core features.

### v1.1.0

- Improved performance and bug fixes.

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests on the [GitHub repository](https://github.com/your-repo).

## License

This extension is licensed under the MIT License.

