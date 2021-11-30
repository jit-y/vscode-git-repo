import { FileType, Uri } from "vscode";

export class RepoFile {
  filetype: FileType;
  private filepath: string;

  constructor(filepath: string, filetype: FileType) {
    this.filepath = filepath;
    this.filetype = filetype;
  }

  get uri(): Uri {
    return Uri.parse(this.filepath);
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
