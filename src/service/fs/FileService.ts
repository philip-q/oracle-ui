import FileMetadataModel from "../../models/FileMetadataModel";

const remote = window.require("electron").remote;
const fs = remote.require("fs");
const path = remote.require("path");

class FileService {
	
	public getDirEntriesPaths = (dirPath): Promise<string[]> => {
		return new Promise((resolve, reject) => {
			fs.readdir(dirPath, (err, directoryEntries) => {
				if (err) {
					reject(err);
				}
				resolve(directoryEntries.map(entry => path.join(dirPath, entry)));
			});
		})
	};
	
	public getFileModels = (filePaths): Promise<FileMetadataModel[]> => {
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
	
	public getDirFilesMetadata = (path): Promise<FileMetadataModel[]> => {
		return this.getDirEntriesPaths(path)
			.then(this.getFileModels)
			.then((content) => {
				return content;
			})
	};
	
}

export {FileService as FileServiceType};
export default new FileService();
