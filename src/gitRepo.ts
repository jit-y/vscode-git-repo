import * as vscode from "vscode";
import { Uri } from "vscode";
import { RepositoryPicker, RepositoryPickItem } from "./repositoryPicker";

export class GitRepo {
  private rootPath: Uri;

  constructor(rootPath: Uri) {
    this.rootPath = rootPath;
  }

  async select() {
    const dir = await vscode.workspace.fs.readDirectory(this.rootPath);

    const pickItems = [];
    for (const item of dir) {
      const path = item[0];
      const fileType = item[1];
      if (fileType !== vscode.FileType.Directory) {
        continue;
      }

      const pickItem = new RepositoryPickItem(path, path);
      pickItems.push(pickItem);
    }

    const picker = new RepositoryPicker(pickItems);
    picker.run();
  }
}
