import { Uri } from "vscode";
import { OpenStrategy, RepositoryPicker } from "./repositoryPicker";

export class GitRepo {
  constructor(private rootUri: Uri) { }

  async open(openStrategy?: OpenStrategy) {
    const picker = new RepositoryPicker([this.rootUri], openStrategy);
    picker.run();
  }
}
