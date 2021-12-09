import * as vscode from "vscode";
import { GitExtension } from "./@types/git";
import { Err, Ok, Result } from "./result";

export class GitCommand {
  readonly #gitApi;
  readonly #gitPath;

  constructor(extension: vscode.Extension<GitExtension>) {
    this.#gitApi = extension.exports.getAPI(1);
    this.#gitPath = this.#gitApi.git.path;
  }
}

export function createGitCommand(): Result<GitCommand, Error> {
  const extension = vscode.extensions.getExtension<GitExtension>("vscode.git");
  if (extension === undefined) {
    return Err(new Error("extension vscode.git is not found"));
  }

  const gitCommand = new GitCommand(extension);

  return Ok(gitCommand);
}
