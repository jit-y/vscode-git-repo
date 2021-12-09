import { QuickPick, QuickPickItem, Uri } from "vscode";
import * as vscode from "vscode";
import { localRepositories, Walker, WalkerOp } from "./walker";
import { File } from "./file";

const fs = vscode.workspace.fs;

export class RepositoryPickItem implements QuickPickItem {
  readonly label: string;
  readonly alwaysShow: boolean;

  readonly uri: Uri;

  constructor(uri: Uri) {
    this.uri = uri;
    this.label = uri.fsPath;
    this.alwaysShow = true
  }
}

export const OpenStrategy = {
  Folder: "Folder",
  Workspace: "Workspace"
};
export type OpenStrategy = typeof OpenStrategy[keyof typeof OpenStrategy];

export class RepositoryPicker {
  readonly #picker: QuickPick<RepositoryPickItem>;
  readonly #openStrategy: OpenStrategy;
  readonly #rootUris: Uri[];

  constructor(rootUris: Uri[], openStrategy?: OpenStrategy) {
    this.#rootUris = rootUris;
    this.#picker = this.initPicker();
    this.#openStrategy = openStrategy || OpenStrategy.Folder;
  }

  async run() {
    this.#picker.enabled = false;

    await this.setPickItems();

    this.show();

    this.#picker.enabled = true;
  }

  initPicker(): QuickPick<RepositoryPickItem> {
    const picker: QuickPick<RepositoryPickItem> = vscode.window.createQuickPick();

    picker.onDidHide(this.onDidHide.bind(this));
    picker.onDidAccept(this.onDidAccept.bind(this));

    return picker;
  }

  show() {
    this.#picker.show();
  }

  dispose() {
    this.#picker.dispose();
  }

  onDidAccept() {
    const item = this.#picker.selectedItems[0];

    if (item != null) {
      this.dispose();

      this.openUri(item.uri);
    }
  }

  onDidHide() {
    this.dispose();
  }

  openUri(uri: Uri) {
    switch (this.#openStrategy) {
      case OpenStrategy.Folder:
        vscode.commands.executeCommand("vscode.openFolder", uri, { forceNewWindow: true });
        break;
      case OpenStrategy.Workspace:
        vscode.workspace.updateWorkspaceFolders(
          vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
          null,
          { uri: uri },
        );
        break;
      default:
        console.error("undefined OpenStrategy");
        break;
    }
  }

  async setPickItems() {
    const uri = this.#rootUris[0];
    const stat = await fs.stat(uri);
    const file = new File(uri.fsPath, stat.type)

    const items = await localRepositories<RepositoryPickItem>(file, f => new RepositoryPickItem(f.uri));

    this.#picker.items = items;
  }
}
