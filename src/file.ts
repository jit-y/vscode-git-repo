import { FileType, Uri } from "vscode";

export class File {
  filetype: FileType;
  #absPath: string;

  constructor(absPath: string, filetype: FileType) {
    this.#absPath = absPath;
    this.filetype = filetype;
  }

  get absUri(): Uri {
    return Uri.parse(this.#absPath);
  }

  isFile(): boolean {
    return this.filetype === FileType.File;
  }

  isDir(): boolean {
    return this.filetype === FileType.Directory;
  }

  isSymlink(): boolean {
    return this.filetype === FileType.SymbolicLink;
  }

  isUnknown(): boolean {
    return this.filetype === FileType.Unknown;
  }
}
