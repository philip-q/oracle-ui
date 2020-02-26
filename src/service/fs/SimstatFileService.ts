import store from "../../store/store";
import fspath from "path";
import FileService from "./FileService";
import {SIMULATION_STATS_FILE_CLOSED, SIMULATION_STATS_FILE_OPENED} from "../../store/actions";
import FileMetadataModel from "../../models/FileMetadataModel";
import FileModel from "../../models/FileModel";
import {getEpochFromPath} from "../../util/formatting";
import {getNeighbourItems} from "../../util/arrays";

const remote = window.require("electron").remote;
const fs = remote.require("fs");
const path = remote.require("path");


class SimstatFileService {
	
	public readSimStatWithSiblingInfo = (metadata: FileMetadataModel) => {
		Promise.all([
			this.readSimulationStats(metadata),
			this.getSiblingMetadata(metadata)
		]).then(([content, [prev, next]]) =>
			store.dispatch({type: SIMULATION_STATS_FILE_OPENED, payload: {file: new FileModel({content, metadata}), prev, next}})
		)
	};
	
	private getSiblingMetadata = (targetMetadata: FileMetadataModel): Promise<[FileMetadataModel, FileMetadataModel]> => {
		let parentDir = fspath.join(targetMetadata.path, "../../");
		return FileService.getDirFilesMetadata(parentDir)
			.then(metadataList => {
				let onlyDirs = metadataList.filter((md) => md.isDirectory && md.name.match(/^\d+_\d+$/));
				let otherSimstatPaths = onlyDirs.map(dm => fspath.join(dm.path, "mc_sim_progress.json")).filter(path => fs.existsSync(path));
				otherSimstatPaths.sort((a, b) => getEpochFromPath(a) - getEpochFromPath(b));
				const {prev, next} = getNeighbourItems(targetMetadata.path, otherSimstatPaths);
				return FileService.getFileModels([prev, next]).then(array => [array[0], array[1]]);
			})
	};
	
	private readSimulationStats = (fileMetadata: FileMetadataModel): Promise<any> => {
		return new Promise<any>((resolve => {
			fs.readFile(fileMetadata.path, (err, data) => {
				if (err) throw err;
				resolve(JSON.parse(data))
			});
		}))
	};
	
	public closeSimulationResultsFile = (): void => {
		store.dispatch({type: SIMULATION_STATS_FILE_CLOSED})
	};
	
}

export {SimstatFileService as SimstatFileServiceType};
export default new SimstatFileService();

