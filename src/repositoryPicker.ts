import { QuickPick, QuickPickItem, Uri } from "vscode";
import * as vscode from "vscode";
import { Walker, WalkerOp } from "./walker";
import { RepoFile } from "./repoFile";
import { Worker } from "cluster";

const fs = vscode.workspace.fs;

export class RepositoryPickItem implements QuickPickItem {
  label: string;
  alwaysShow: boolean;

  uri: Uri;

  constructor(path: string, label: string) {
    this.uri = Uri.from({ scheme: "vscode", path: path });
    this.label = label;
    this.alwaysShow = true
  }
}

export class RepositoryPicker {
  private readonly picker: QuickPick<RepositoryPickItem>;

  constructor(private readonly rootUris: Uri[]) {
    this.picker = this.initPicker();
  }

  async run() {
    this.picker.enabled = false;

    await this.setPickItems();

    this.show();

    this.picker.enabled = true;
  }

  initPicker(): QuickPick<RepositoryPickItem> {
    const picker: QuickPick<RepositoryPickItem> = vscode.window.createQuickPick();

    picker.onDidHide(this.onDidHide.bind(this));
    picker.onDidAccept(this.onDidAccept.bind(this));

    return picker;
  }

  show() {
    this.picker.show();
  }

  dispose() {
    this.picker.dispose();
  }

  onDidAccept() {
    const item = this.picker.selectedItems[0];

    if (item != null) {
      this.dispose();
      vscode.env.openExternal(item.uri);
    }
  }

  onDidHide() {
    this.dispose();
  }

  async setPickItems() {
    const uri = this.rootUris[0];
    const stat = await fs.stat(uri);
    const repoFile = new RepoFile(uri.fsPath, stat.type)
    const items: RepositoryPickItem[] = [];

    const callbackFn = async (repoFile: RepoFile): Promise<WalkerOp> => {
      if (!repoFile.isDir()) {
        return WalkerOp.Continue;
      }

      const gitUri = Uri.joinPath(repoFile.uri, ".git");

      try {
        const stat = await fs.stat(gitUri);
        if (stat.type === vscode.FileType.SymbolicLink) {
          return WalkerOp.Continue;
        }

        const pickItem = new RepositoryPickItem(repoFile.uri.fsPath, repoFile.uri.fsPath);
        items.push(pickItem);

        return WalkerOp.SkipChildren;
      } catch (e) { }

      return WalkerOp.Continue;
    };

    const walker = new Walker(callbackFn);
    await walker.walk(repoFile);

    this.picker.items = items;
  }
}
