import React from "react";
import {connect} from "react-redux"
import {StoreState} from "../store/store";
import FileModel from "../models/FileModel";
import SimulationResultView from "./file_views/simulation_result/SimulationResultView";
import Screen from "./Screen";
import SimstatFileService from "../service/fs/SimstatFileService"
import {displayedSimulationPath} from "../util/formatting";

interface OpenedFilesProps {
	simulationResultFile: FileModel | null
}

class OpenedFiles extends React.Component<OpenedFilesProps> {
	
	render() {
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
			<Screen onClose={SimstatFileService.closeSimulationResultsFile} title={displayedSimulationPath(simulationResultFile.metadata.path)}>
				<SimulationResultView file={simulationResultFile}/>
			</Screen>
		</div>
		
	}
	
}

const mapStateToProps = (state: StoreState): OpenedFilesProps => ({
	simulationResultFile: state.fs.simulationResultFile
});

export default connect(mapStateToProps)(OpenedFiles)


