import FileModel from "../models/FileModel";
import lineStreamUtil from "line-stream-util";
import TickPrediction from "../models/TickPrediction";

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
    console.log("Reading csv data of ", dataPath);
    let csvDataHolder = {
      columns: [],
      data: [],
    };

    let data = fs.readFileSync(dataPath, {encoding: "utf-8"});
    let columns = [];

    let rows = data.split("\n");

    columns = rows[0].split(CSV_SEPARATOR);
    if (columns[0] === "") {
      columns[0] = "index";
    }
    rows = rows.slice(1);


    rows = rows.map(row => {
      const values = row.split(CSV_SEPARATOR);
      let tickPredictionBuilder = columns.reduce((builder, columnName, index) => {
        builder[columnName] = values[index];
        return builder;
      }, {});
      return new TickPrediction(tickPredictionBuilder);
    });

    csvDataHolder.data = rows;
    console.log(csvDataHolder.data.length);

    csvDataHolder.data.forEach((row, index, array) => {
      if (row.length !== array[0].length) {
        console.error(`wrong length! index: ${index}, row: ${row}`)
      }
    });
    console.log("done");
    resolve(csvDataHolder);

  })
};

export const readCsvData2 = (dataPath) => {
  return new Promise((resolve) => {
    console.log("Reading csv data of ", dataPath);
    let csvDataHolder = {
      columns: [],
      data: [],
    };

    let allData = "";
    let columns = [];

    fs.createReadStream(dataPath, {
      encoding: 'utf-8',
    })
      .on('data', (data) => {
        // it can cut a number in the middle and it's too complicated to fix that. easier to concat huge string
        console.log("on data");
        console.log(data);
        allData += data;
      })
      .on('end', (end) => {
        console.log("************ on end");
        console.log(end);
        let rows = allData.split("\n");

        columns = rows[0].split(CSV_SEPARATOR);
        if (columns[0] === "") {
          columns[0] = "index";
        }
        rows = rows.slice(1);


        rows = rows.map(row => {
          const values = row.split(CSV_SEPARATOR);
          let tickPredictionBuilder = columns.reduce((builder, columnName, index) => {
            builder[columnName] = values[index];
            return builder;
          }, {});
          return new TickPrediction(tickPredictionBuilder);
        });

        csvDataHolder.data.push(...rows);
        console.log(csvDataHolder.data.length);

        csvDataHolder.data.forEach((row, index, array) => {
          if (row.length !== array[0].length) {
            console.error(`wrong length! index: ${index}, row: ${row}`)
          }
        });
        console.log("done");
        resolve(csvDataHolder);
      })
  });
};