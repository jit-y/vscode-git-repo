import { workspace } from "vscode";
import { RepoFile } from "./repoFile";

const fs = workspace.fs;

export const WalkerStatus = {
  Continue: "Continue",
  SkipChildren: "SkipChildren"
};
type WalkerOp = typeof WalkerStatus[keyof typeof WalkerStatus];

export class Walker {
  callbackFn: (file: RepoFile) => WalkerOp;

  constructor(callbackFn: (file: RepoFile) => WalkerOp) {
    this.callbackFn = callbackFn;
  }

  async walk(file: RepoFile): Promise<null> {
    const res = this.callbackFn(file);
    if (res === WalkerStatus.SkipChildren) {
      return null;
    }

    const dir = await fs.readDirectory(file.uri);
    await Promise.all(dir.map(async item => {
      const f = new RepoFile(item[0], item[1]);

      await this.walk(f);

      return;
    }));

    return null;
  }
}
