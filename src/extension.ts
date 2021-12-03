// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitRepo } from './gitRepo';
import { OpenStrategy } from './repositoryPicker';

function openAsFolder() {
	const rootPath = vscode.workspace.getConfiguration().get<string>("vscode-git-repo.rootPath");

	if (rootPath != undefined) {
		const uri = vscode.Uri.parse(rootPath);
		const gitRepo = new GitRepo(uri);
		gitRepo.open(OpenStrategy.Folder);
	}
}

function openAsWorkspace() {
	const rootPath = vscode.workspace.getConfiguration().get<string>("vscode-git-repo.rootPath");

	if (rootPath != undefined) {
		const uri = vscode.Uri.parse(rootPath);
		const gitRepo = new GitRepo(uri);
		gitRepo.open(OpenStrategy.Workspace);
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

	context.subscriptions.push(vscode.commands.registerCommand('vscode-git-repo.openAsFolder', openAsFolder));
	context.subscriptions.push(vscode.commands.registerCommand('vscode-git-repo.openAsWorkspace', openAsWorkspace));
}

// this method is called when your extension is deactivated
export function deactivate() { }
