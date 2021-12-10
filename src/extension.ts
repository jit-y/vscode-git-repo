// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configuration } from './configuration';
import { RepositoryManager } from './repositoryManager';
import { OpenStrategy } from './repositoryPicker';

function openAs(strategy: OpenStrategy) {
	const configuration = new Configuration();

	if (configuration.rootPath != undefined) {
		const uri = vscode.Uri.parse(configuration.rootPath);
		const gitRepo = new RepositoryManager(uri);
		gitRepo.open(strategy);
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-git-repo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'vscode-repository-manager.openAsFolder',
			openAs.bind(null, OpenStrategy.Folder)
		)
	);
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'vscode-repository-manager.openAsWorkspace',

			openAs.bind(null, OpenStrategy.Workspace)
		)
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
