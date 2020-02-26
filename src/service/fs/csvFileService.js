import TickPrediction from "../../models/TickPrediction";

const remote = window.require("electron").remote;
const fs = remote.require("fs");
const CSV_SEPARATOR = ",";



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
