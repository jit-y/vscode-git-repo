import { workspace } from "vscode";
import { File } from "./file";

const fs = workspace.fs;

class walker {
  callbackFn: (file: File) => {};

  constructor(callbackFn: (file: File) => {}) {
    this.callbackFn = callbackFn;
  }

  async walk(file: File): Promise<void[]> {
    this.callbackFn(file);

    const dir = await fs.readDirectory(file.uri);

    return Promise.all(dir.map(async item => {
      const f = new File(item[0], item[1]);

      await this.walk(f);

      return;
    }));
  }
}
