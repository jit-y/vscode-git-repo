import { QuickPick, QuickPickItem, Uri } from "vscode";
import * as vscode from "vscode";

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
  private picker: QuickPick<RepositoryPickItem>;

  constructor(items: ReadonlyArray<RepositoryPickItem>) {
    this.picker = this.initPicker();
    this.picker.items = items;
  }

  async run() {
    this.picker.enabled = false;

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
}
