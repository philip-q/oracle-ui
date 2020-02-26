import {readCsvData} from "./csvFileService";
import SimstatFileService from "./SimstatFileService";


class FileContentReader {
	
	public readFileContent = (fileMetadata) => {
		if (fileMetadata.extension === ".csv") {
			readCsvData(fileMetadata);
			return;
		}
		
		if (fileMetadata.extension === ".simstat" || fileMetadata.name.startsWith("mc_sim_progress")) {
			SimstatFileService.readSimStatWithSiblingInfo(fileMetadata);
			return;
		}
		
		console.log(`Don't know how to handle ${fileMetadata.name}`)
	};
	
}
export {FileContentReader as FileContentReaderType};
export default new FileContentReader();
