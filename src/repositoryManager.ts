import { Uri } from "vscode";
import { OpenStrategy, RepositoryPicker } from "./repositoryPicker";

export class RepositoryManager {
  #rootUri: Uri

  constructor(rootUri: Uri) {
    this.#rootUri = rootUri;
  }

  async open(openStrategy?: OpenStrategy) {
    const picker = new RepositoryPicker([this.#rootUri], openStrategy);
    picker.run();
  }
}
