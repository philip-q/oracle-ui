import FileModel from "../models/FileModel";
import lineStreamUtil from "line-stream-util";

const remote = window.require("electron").remote;

const fs = remote.require("fs");
const path = remote.require("path");

const CSV_SEPARATOR = ",";

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

export const readCsvData = (dataPath) => {
  return new Promise((resolve) => {
    dataPath = "/home/salty/work/oracle-ui/resources/csv/predictions_e-28.csv";
    console.log("loading path ", dataPath);

    /*const data = [];
    fs.createReadStream(path)
      .pipe(csvParse({delimiter: ','}))

      .on('data', (r) => {
        console.log(r);
        data.push(r);
        resolve(r);
      });
      setTimeout(() => resolve(data), 1000)*/
    let data = [];

    let batchesProcessed = 0;

    let csvDataHolder = {
      columns: [],
      data: [],
    };

    let allData = "";

    fs.createReadStream(dataPath, {
      encoding: 'utf-8',
    })
      .on('data', (data) => {
        let rows = data.split("\n");

        if (!batchesProcessed++) {
          csvDataHolder.columns = rows[0].split(CSV_SEPARATOR);
          rows = rows.slice(1);
        }

        rows = rows.map(row => row.split(CSV_SEPARATOR));

        csvDataHolder.data.push(...rows);
        console.log(csvDataHolder.data.length);
      })
      .on('end', (row) => {
        console.log("end ", row);
        csvDataHolder.data.forEach((row, index, array) => {
          if(row.length !== array[0].length) {
            console.error(`wrong length! index: ${index}, row: ${row}`)
          }
        });
        console.log("done");
      })
  });
};