import FileMetadataModel from "../models/FileMetadataModel";
import TickPrediction from "../models/TickPrediction";

import store from "../store/store";
import {SIMULATION_STATS_FILE_CLOSED, SIMULATION_STATS_FILE_OPENED} from "../store/actions";
import FileModel from "../models/FileModel";

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
				resolve(new FileMetadataModel({
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

export const getDirFilesMetadata = (path) => {
	return getDirEntriesPaths(path)
		.then(getFileModels)
		.then(logContent)
};

export const readFileContent = (fileMetadata) => {
	switch (fileMetadata.extension) {
		case ".csv":
			readCsvData(fileMetadata);
			break;
		
		case ".simstat":
			readSimulationStats(fileMetadata);
			break;
		
		default:
			break;
		
	}
	
};

export const readSimulationStats = (fileMetadata) => {
	return new Promise((resolve) => {
		let dataString = fs.readFileSync(fileMetadata.path);
		let parsedFileContent = JSON.parse(dataString);
		store.dispatch({
			type: SIMULATION_STATS_FILE_OPENED,
      payload: new FileModel({metadata: fileMetadata, content: parsedFileContent})
		});
		resolve(parsedFileContent);
	});
};

export const readCsvData = (fileMetadata) => {
	return new Promise((resolve) => {
		console.log("Reading csv data of ", fileMetadata);
		let csvDataHolder = {
			columns: [],
			data: [],
		};
		
		let data = fs.readFileSync(fileMetadata.path, {encoding: "utf-8"});
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

export const closeSimulationResultsFile = () => {
	store.dispatch({type: SIMULATION_STATS_FILE_CLOSED})
};
