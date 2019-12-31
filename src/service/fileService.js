import FileModel from "../models/FileModel";

const parse = require('csv-parse');

const remote = window.require("electron").remote;

const fs = remote.require("fs");
const path = remote.require("path");

const getDirEntriesPaths = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, directoryEntries) => {
      if (err) {
        reject(err);
      }
      resolve(directoryEntries.map(entry => path.join(dirPath, entry)));
    });
  })
};

const getFileModels = (filePaths) => {
  return Promise.all(
    filePaths.map(filePath => new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) reject(err);
        resolve(new FileModel({
          path: filePath,
          size: stats.size,
          modificationDate: stats.mtime,
          isDirectory: stats.isDirectory()
        }));
      });
    }))
  );
};

const logContent = (content) => {
  console.log(content);
  return content;
};

export const getDirFiles = (path) => {
  return getDirEntriesPaths(path)
    .then(getFileModels)
    .then(logContent)
};

export const readCsvData = (path) => {
  return new Promise((resolve) => {
    path = "/home/salty/work/oracle-ui/resources/csv/predictions_e-28_cut.csv";
    console.log("loading path ", path);
    /*const data = [];
    fs.createReadStream(path)
      .pipe(csvParse({delimiter: ','}))

      .on('data', (r) => {
        console.log(r);
        data.push(r);
        resolve(r);
      });
      setTimeout(() => resolve(data), 1000)*/
    fs.createReadStream(path, {
      flag: 'a+',
      encoding: 'ascii',
    })
      .on('data', (row) => {
        console.log(row);
      })
  });
};