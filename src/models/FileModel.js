import {path} from "../service/adapters/safeAdapters"

export default class FileModel {

  path;
  name;
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
    return path.basename(this.path);
  }

  get extension() {
    return path.extname(this.path)
  }
}