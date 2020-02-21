import React from "react";
import {connect} from "react-redux"
import {StoreState} from "../store/store";
import FileModel from "../models/FileModel";
import SimulationResultView from "./file_views/SimulationResultView";
import Screen from "./Screen";

import {closeSimulationResultsFile} from "../service/fileService"

interface OpenedFilesProps {
	simulationResultFile: FileModel | null
}

class OpenedFiles extends React.Component<OpenedFilesProps> {
	
	render() {
		console.log("render OpenedFiles", this.props);
		
		return <div className="OpenedFiles">
			{this.renderSimulationResultContent()}
		</div>
	}
	
	renderSimulationResultContent() {
		const {simulationResultFile} = this.props;
		
		if (!simulationResultFile) {
			return null;
		}
		
		return <div className="OpenedFiles__simulation-result">
			<Screen onClose={closeSimulationResultsFile} title={simulationResultFile.metadata.name}>
				<SimulationResultView file={simulationResultFile}/>
			</Screen>
		</div>
		
	}
	
}

const mapStateToProps = (state: StoreState): OpenedFilesProps => ({
	simulationResultFile: state.fs.simulationResultFile
});

export default connect(mapStateToProps)(OpenedFiles)


