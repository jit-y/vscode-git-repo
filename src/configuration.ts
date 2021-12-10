import { workspace } from "vscode";

export class Configuration {
  get rootPath(): string | undefined {
    return workspace.getConfiguration().get<string>("vscode-git-repo.rootPath");
  }
}
