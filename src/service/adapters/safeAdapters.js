import fspath from "path";
import fs from "fs";
import FileMetadataModel from "../../models/FileMetadataModel";

if(!fspath) {
  console.log("Electron path import");
  const remote = window.require("electron").remote;
  fspath = remote.require("path");
  const fs = remote.require("fs");
  // eslint-disable-next-line no-undef
  define("fs", () => {
    return fs;
  })
}

const isElectronApp = () => {
  return !!(window && window.process && window.process.type)
};

let file_service = null;

const getFileService = () => {
  if (file_service) {
    return Promise.resolve(file_service);
  } else {
    if (isElectronApp()) {
      return import("../fileService").then((fs) => {
        console.log("Imported real file service.");
        file_service = fs;
        return Promise.resolve(fs);
      })
    } else {
      return import("../fileServiceBrowserMock").then((mockfs) => {
        console.log("Imported mock file service.");
        file_service = mockfs;
        return Promise.resolve(mockfs);
      })
    }
  }
};

const getDirFilesMetadata = (path) => {
  return getFileService().then(fs => fs.getDirFilesMetadata(path));
};

const readCsvData = (path) => {
  return getFileService().then(fs => fs.readCsvData(path));
};

export const readFileContent = (fileMetaData) => {
  if (fileMetaData.extension === ".simstat") {
    getFileService().then(fs => fs.readFileContent(fileMetaData));
  }
  
  return Promise.resolve();
};

export {
  fspath,
  getDirFilesMetadata, readCsvData
};
