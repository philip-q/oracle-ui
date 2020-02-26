import React from "react";
import FileModel from "../../../models/FileModel";
import {formatNumber, getEpochFromPath} from "../../../util/formatting";
import SimulationsSummary from "../../../models/SimulationSummaryModel";
import SimulationPerformanceModel from "../../../models/SimulationPerformanceModel";
import SimstatFileService from "../../../service/fs/SimstatFileService";
import {StoreState} from "../../../store/store";
import {connect} from "react-redux";
import FileMetadataModel from "../../../models/FileMetadataModel";
import Button from "../../Button";
import PairSimulationProgress from "./PairSimulationProgress";
import TotalPairsSimulationProgress from "./TotalPairsSimulationProgress";
import {max} from "rxjs/operators";
import {getNeighbourItems} from "../../../util/arrays";

interface SimulationResultViewParentProps {
	file: FileModel;
}

interface SimulationResultViewStoreProps {
	nextSimulationResultFileMetadata: FileMetadataModel | null;
	prevSimulationResultFileMetadata?: FileMetadataModel | null;
}

interface SimulationResultViewProps extends SimulationResultViewParentProps, SimulationResultViewStoreProps {
}

interface SimulationResultViewState {
	filePath: string;
	summary: SimulationsSummary;
	selectedPairsKeys: Array<String>;
	selectedPairKey: string | null;
}

class SimulationResultView extends React.Component<SimulationResultViewProps, SimulationResultViewState> {
	
	constructor(props) {
		super(props);
		
		let summary = new SimulationsSummary(props.file);
		this.state = {
			filePath: props.file.metadata.path,
			summary,
			selectedPairsKeys: Array.from(summary.totalPairPerformances.keys()),
			selectedPairKey: null
		}
	}
	
	static getDerivedStateFromProps(nextProps: SimulationResultViewProps, prevState: SimulationResultViewState) {
		if (prevState.filePath !== nextProps.file.metadata.path) {
			let summary = new SimulationsSummary(nextProps.file);
			return {
				filePath: nextProps.file.metadata.path,
				summary,
				selectedPairsKeys: prevState.selectedPairsKeys || Array.from(summary.totalPairPerformances.keys())
			}
		}
		return null;
	}
	
	render() {
		return <div className="SimulationResultView">
			{this.renderHeader()}
			{this.renderContent()}
		</div>
	}
	
	renderHeader() {
		
		return <div className="SimulationResultView__header">
			{this.renderTotalPerformance()}
			{this.renderNavigation()}
		</div>
	}
	
	renderNavigation() {
		const {selectedPairsKeys, selectedPairKey} = this.state;
		const {prevSimulationResultFileMetadata: prev, nextSimulationResultFileMetadata: next} = this.props;
		
		let buttons: JSX.Element[] = [];
		
		if (selectedPairKey) {
			const {prev, next} = getNeighbourItems(selectedPairKey, selectedPairsKeys);
			
			buttons.push(
				<Button
					onClick={() => this.setState({selectedPairKey: null})}
					text={`X`}>
				</Button>,
				<Button
					onClick={() => this.setState({selectedPairKey: prev as string})}
					text={`<- ${prev}`}>
				</Button>,
				<Button
					onClick={() => this.setState({selectedPairKey: next as string})}
					text={`${next} -> `}>
				</Button>
			)
		}
		
		buttons.push(
			<Button
				onClick={() => this.handleLoadSimDataClick("prev")}
				text={`<- ${prev ? getEpochFromPath(prev.path) : ""}`}>
			</Button>,
			<Button
				onClick={() => this.handleLoadSimDataClick("next")}
				text={`${next ? getEpochFromPath(next.path) : ""} ->`}>
			</Button>
		);
		
		return <div className="SimulationResultView__navigation">
			{selectedPairKey && <span className="SimulationResultView__navigation__pair">{selectedPairKey}</span>}
			{buttons}
		</div>
	}
	
	renderContent() {
		return <div className="SimulationResultView__content">
			{this.chooseContent()}
		</div>
	}
	
	chooseContent() {
		const {selectedPairKey, summary, selectedPairsKeys} = this.state;
		if (selectedPairKey) {
			let pairProgress = summary.pairPeriodPerformances.get(selectedPairKey) || new Map<number, SimulationPerformanceModel>();
			return <PairSimulationProgress progress={pairProgress}/>
		}
		
		return <TotalPairsSimulationProgress
			summary={summary} selectedPairsKeys={selectedPairsKeys}
			onChartBarClick={this.handleSimulationChartBarClick} onCurrencyPairCheck={this.handlePairPerformanceSelectorClick}
		/>
	}
	
	handleLoadSimDataClick = (direction: "prev" | "next") => {
		const {prevSimulationResultFileMetadata: prev, nextSimulationResultFileMetadata: next} = this.props;
		direction === "prev" && prev && SimstatFileService.readSimStatWithSiblingInfo(prev);
		direction === "next" && next && SimstatFileService.readSimStatWithSiblingInfo(next);
	};
	
	renderTotalPerformance() {
		const {selectedPairKey, summary} = this.state;
		
		let performance;
		
		if (selectedPairKey) {
			performance = summary.totalPairPerformances.get(selectedPairKey) || this.getSelectedPairsTotalPerformance();
		} else {
			performance = this.getSelectedPairsTotalPerformance();
		}
		
		return <div className="SimulationResultView__total">
			<div
				key="usd-performance"
				className={`SimulationResultView__metric SimulationResultView__metric--${performance.usdPerformance > 0 ? "profit" : "loss"}`}>
				Usd total performance: {formatNumber(performance.usdPerformance)}
			</div>
			<div
				key="pa-performance"
				className={`SimulationResultView__metric SimulationResultView__metric--${performance.profitArea > 0 ? "profit" : "loss"}`}>
				Total performance area: {formatNumber(performance.profitArea)}
			</div>
		</div>
	}
	
	handleSimulationChartBarClick = (pairName: string): void => {
		this.setState({selectedPairKey: pairName});
	};
	
	private getSelectedPairsTotalPerformance = (): SimulationPerformanceModel => {
		return this.state.selectedPairsKeys.reduce<SimulationPerformanceModel>((sum, item) => {
			let {usdPerformance, profitArea} = this.state.summary.totalPairPerformances.get(item) || new SimulationPerformanceModel();
			return new SimulationPerformanceModel(usdPerformance + sum.usdPerformance, profitArea + sum.profitArea)
		}, new SimulationPerformanceModel());
	};
	
	
	handlePairPerformanceSelectorClick = (pairKey) => {
		if (this.isPairSelected(pairKey)) {
			this.setState({selectedPairsKeys: this.state.selectedPairsKeys.filter(item => item !== pairKey)})
		} else {
			this.setState({selectedPairsKeys: this.state.selectedPairsKeys.concat(pairKey)})
		}
	};
	
	isPairSelected = (pair: String): boolean => {
		return this.state.selectedPairsKeys.indexOf(pair) >= 0;
	};
	
}

const mapStateToProps = (state: StoreState): SimulationResultViewStoreProps => ({
	nextSimulationResultFileMetadata: state.fs.nextSimulationResultFile,
	prevSimulationResultFileMetadata: state.fs.prevSimulationResultFile
});

export default connect(mapStateToProps)(SimulationResultView)
