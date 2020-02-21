import fspath from "path";

export default class FileMetadataModel {

  path;
  size;
  modificationDate;
  isDirectory;

  constructor(builder) {
    this.path = builder.path;
    this.size = builder.size;
    this.modificationDate = builder.modificationDate;
    this.isDirectory = builder.isDirectory;
  }

  get name() {
    return fspath.basename(this.path);
  }

  get extension() {
    return fspath.extname(this.path)
  }
}
