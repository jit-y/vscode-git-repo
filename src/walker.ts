import * as vscode from "vscode";
import { workspace, Uri } from "vscode";
import { File } from "./file";

const fs = workspace.fs;

export const WalkerOp = {
  Continue: "Continue",
  SkipChildren: "SkipChildren"
};
export type WalkerOp = typeof WalkerOp[keyof typeof WalkerOp];

export class Walker {
  readonly #callbackFn: (file: File) => Promise<WalkerOp>;

  constructor(callbackFn: (file: File) => Promise<WalkerOp>) {
    this.#callbackFn = callbackFn;
  }

  async walk(file: File): Promise<null> {
    const res = await this.#callbackFn(file);
    if (res === WalkerOp.SkipChildren) {
      return null;
    }

    const dir = await fs.readDirectory(file.uri);
    await Promise.all(dir.map(async item => {
      const absPath = Uri.joinPath(file.uri, item[0]);
      const f = new File(absPath.fsPath, item[1]);

      await this.walk(f);

      return;
    }));

    return null;
  }
}

export async function localRepositories<T>(root: File, intoFn: (file: File) => T): Promise<T[]> {
  const items: T[] = [];

  const callbackFn = async (repoFile: File): Promise<WalkerOp> => {
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
