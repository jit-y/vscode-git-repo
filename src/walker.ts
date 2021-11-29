import { workspace } from "vscode";
import { RepoFile } from "./repoFile";

const fs = workspace.fs;

class walker {
  callbackFn: (file: RepoFile) => {};

  constructor(callbackFn: (file: RepoFile) => {}) {
    this.callbackFn = callbackFn;
  }

  async walk(file: RepoFile): Promise<void[]> {
    this.callbackFn(file);

    const dir = await fs.readDirectory(file.uri);

    return await Promise.all(dir.map(async item => {
      const f = new RepoFile(item[0], item[1]);

      await this.walk(f);

      return;
    }));
  }
}
