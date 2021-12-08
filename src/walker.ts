import * as vscode from "vscode";
import { workspace, Uri } from "vscode";
import { RepoFile } from "./repoFile";

const fs = workspace.fs;

export const WalkerOp = {
  Continue: "Continue",
  SkipChildren: "SkipChildren"
};
export type WalkerOp = typeof WalkerOp[keyof typeof WalkerOp];

export class Walker {
  callbackFn: (file: RepoFile) => Promise<WalkerOp>;

  constructor(callbackFn: (file: RepoFile) => Promise<WalkerOp>) {
    this.callbackFn = callbackFn;
  }

  async walk(file: RepoFile): Promise<null> {
    const res = await this.callbackFn(file);
    if (res === WalkerOp.SkipChildren) {
      return null;
    }

    const dir = await fs.readDirectory(file.uri);
    await Promise.all(dir.map(async item => {
      const absPath = Uri.joinPath(file.uri, item[0]);
      const f = new RepoFile(absPath.fsPath, item[1]);

      await this.walk(f);

      return;
    }));

    return null;
  }
}

export async function localRepositories<T>(root: RepoFile, intoFn: (file: RepoFile) => T): Promise<T[]> {
  const items: T[] = [];

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

    const item = intoFn(repoFile);
    items.push(item);

    return WalkerOp.SkipChildren;
  };

  const walker = new Walker(callbackFn);
  await walker.walk(root);

  return items;
}
