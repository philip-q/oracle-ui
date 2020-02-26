import React from "react";
import fspath from "path";

import {File} from "./File";
import FileMetadataModel from "../models/FileMetadataModel";
import FileService from "../service/fs/FileService";
import FileContentReader from "../service/fs/FileContentReader";

interface FileBrowserState {
  path: string;
  files: FileMetadataModel[];
  csvHolder: any;
}

export class FileBrowser extends React.Component<{}, FileBrowserState> {

  constructor(props) {
    super(props);

    this.state = {
      path: "../oracle/output/scenarios/multiple_currencies/sl700_n400_l1_do/simulations/74_86400",
      files: [],
      csvHolder: null
    }
  }

  sortFunction(desc = false) {
    let sortFunction = (f1, f2) => {
      if (f1.isDirectory && !f2.isDirectory) {
        return 1;
      } else if (f2.isDirectory && !f1.isDirectory) {
        return -1;
      } else {
        /* both of same type => sort by name */
        return f1.name.localeCompare(f2.name);
      }
    };

    let orderMultiplier = desc ? -1 : 1;
    return (f1, f2) => orderMultiplier * sortFunction(f1, f2);

  }

  componentDidMount() {
    this.requestFilesList(this.state.path);
  }

  requestFilesList(path) {
    FileService.getDirFilesMetadata(path).then(files => {
      files.sort(this.sortFunction(false));
      this.setState({files, path: path})
    });
  }

  render() {
    return <div className="FileBrowser">
      {/*{this.renderPredictionDetails()}*/}
      {this.renderHead()}
      {this.renderUpNavigation()}
      {this.renderDirectoryContent()}
    </div>
  }

  // renderPredictionDetails() {
  //   if (this.state.csvHolder) {
  //     return <CsvDetails predictions={this.state.csvHolder.data} onClose={this.handleCsvFileClick}/>
  //   }
  // }

  renderHead() {
    return <div className="FileBrowser__head">
      {this.state.path}
    </div>
  }

  renderUpNavigation() {
    console.log(this.state.path);
    let upPath = fspath.join(this.state.path, "../");
    return <div className="FileBrowser__up-navigation" data-path={upPath} onDoubleClick={this.handleDoubleClick}>
      ..
    </div>
  }

  renderDirectoryContent() {
    return <div className="FileBrowser__content">
      {this.state.files.map(file => <span key={file.name} data-path={file.path} onDoubleClick={this.handleDoubleClick}>
        <File file={file}/>
      </span>
      )}
    </div>
  }

  handleDoubleClick = (event) => {
    let targetFilePath = event.currentTarget.getAttribute("data-path");
    let fileMetadata = this.state.files.find(file => file.path === targetFilePath);

    if (!fileMetadata || fileMetadata.isDirectory) {
      this.requestFilesList(targetFilePath);
      return;
    }
  
    FileContentReader.readFileContent(fileMetadata);

  };

  handleCsvFileClick = () => {
    this.setState({csvHolder: null})
  }

}
