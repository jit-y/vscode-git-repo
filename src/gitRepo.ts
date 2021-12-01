import * as vscode from "vscode";
import { Uri } from "vscode";
import { RepositoryPicker, RepositoryPickItem } from "./repositoryPicker";

export class GitRepo {
  constructor(private rootUri: Uri) { }

  async select() {
    const picker = new RepositoryPicker([this.rootUri]);
    picker.run();
  }
}
