import React from "react";
import {File} from "./File";
import {getDirFiles, readCsvData} from "../service/adapters/safeAdapters";
import {path} from "../service/adapters/safeAdapters";
import csvParse from "csv-parse";

export class FileBrowser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      path: "./",
      files: []
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
    getDirFiles(path).then(files => {
      files.sort(this.sortFunction(true));
      this.setState({files, path: path})
    });
  }

  render() {
    return <div className="FileBrowser">
      {this.renderHead()}
      {this.renderUpNavigation()}
      {this.renderDirectoryContent()}
    </div>
  }

  renderHead() {
    return <div className="FileBrowser__head">
      {this.state.path}
    </div>
  }

  renderUpNavigation() {
    let upPath = path.join(this.state.path, "../");
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
    console.log("targetFilePath", targetFilePath);
    let file = this.state.files.find(file => file.path === targetFilePath);
    let parentDirChosen = !file;
    if (parentDirChosen || file.isDirectory) {
      this.requestFilesList(targetFilePath);
    } else if (file.extension === ".csv") {
      readCsvData(targetFilePath);
    }

  }

}