import { Uri, workspace } from "vscode";

export class Configuration {
  get rootPathUri(): Uri | undefined {
    const path = workspace.getConfiguration().get<string>("vscode-repository-manager.rootPath");
    if (path == undefined) {
      return undefined;
    }

    return Uri.parse(path);
  }
}
