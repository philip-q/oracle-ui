import FileMetadataModel from "./FileMetadataModel";

export default class FileModel {

  metadata: FileMetadataModel;
  content: any;

  constructor(builder) {
    this.metadata = builder.metadata;
    this.content = builder.content;
  }

}
