import { QuickPick, QuickPickItem, Uri } from "vscode";
import * as vscode from "vscode";
import { Walker, WalkerOp } from "./walker";
import { RepoFile } from "./repoFile";
import * as child_process from "child_process";

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

      vscode.commands.executeCommand("vscode.openFolder", item.uri, { forceNewWindow: true });
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
      } catch (_e) {
        return WalkerOp.Continue;
      }

      const pickItem = new RepositoryPickItem(repoFile.uri);
      items.push(pickItem);

      return WalkerOp.SkipChildren;
    };

    const walker = new Walker(callbackFn);
    await walker.walk(repoFile);

    this.picker.items = items;
  }
}
