import React from "react";
import FileModel from "../../models/FileModel";
import {formatNumber} from "../../util/formatting";
import Checkbox from "../Checkbox";
import SimulationsSummary from "../../models/SimulationSummaryModel";
import {SimulationMetric} from "../../models/enumerations/SimulationMetric";
import {SortOrder} from "../../models/enumerations/SortOrder";
import SimulationPerformanceModel from "../../models/SimulationPerformanceModel";
import SimulationChart from "./SimulationChart";

interface SimulationResultViewProps {
	file: FileModel
}


interface SimulationResultViewState {
	summary: SimulationsSummary;
	selectedPairsKeys: Array<String>;
	sortingMetric: SimulationMetric;
	sortingOrder: SortOrder;
}

export default class SimulationResultView extends React.Component<SimulationResultViewProps, SimulationResultViewState> {
	
	constructor(props: SimulationResultViewProps) {
		super(props);
		
		let summary = new SimulationsSummary(props.file);
		this.state = {
			summary,
			selectedPairsKeys: Array.from(summary.pairPerformances.keys()),
			sortingMetric: SimulationMetric.USD_PERFORMANCE,
			sortingOrder: SortOrder.DESC
		}
	}
	
	render() {
		return <div className="SimulationResultView">
			{this.renderHeader()}
			<div className="SimulationResultView__content">
				{this.renderChart()}
				{this.renderPairsPerformanceList()}
			</div>
		</div>
	}
	
	renderHeader() {
		return <div className="SimulationResultView__header">
			{this.renderTotalPerformance()}
			{this.renderSortingButtons()}
		</div>
	}
	
	renderSortingButtons() {
		return <div className="SimulationResultView__sorting-buttons">
			{this.renderSortingMetricButton(SimulationMetric.USD_PERFORMANCE, "fa-dollar-sign")}
			{this.renderSortingMetricButton(SimulationMetric.PROFIT_AREA, "fa-chart-area")}
			{this.renderSortingOrderButton()}
		</div>
	}
	
	renderSortingMetricButton(metric: SimulationMetric, iconClass: string) {
		let isSelected = this.state.sortingMetric === metric;
		return <span
			className={`SimulationResultView__sorting-button ${isSelected ? "SimulationResultView__sorting-button--selected" : ""}`}
			onClick={() => {
				console.log("Sorting metric changed to ", metric);
				this.setState({sortingMetric: metric})
			}}
		>
			<i className={`fas ${iconClass}`}/>
		</span>
	}
	
	renderSortingOrderButton() {
		const {sortingOrder} = this.state;
		return <span
			className="SimulationResultView__sorting-button SimulationResultView__sorting-button--order"
			onClick={() => this.setState({sortingOrder: sortingOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC})}
		>
			<i className={`fas ${sortingOrder === SortOrder.ASC ? "fa-sort-amount-up-alt" : "fa-sort-amount-down"}`}/>
		</span>
	}
	
	renderTotalPerformance() {
		let totalPerformance = this.getSelectedPairsTotalPerformance();
		return <div className="SimulationResultView__total">
			<div
				key="usd-performance"
				className={`SimulationResultView__metric SimulationResultView__metric--${totalPerformance.usdPerformance > 0 ? "profit" : "loss"}`}>
				Usd total performance: {formatNumber(totalPerformance.usdPerformance)}
			</div>
			<div
				key="pa-performance"
				className={`SimulationResultView__metric SimulationResultView__metric--${totalPerformance.profitArea > 0 ? "profit" : "loss"}`}>
				Total performance area: {formatNumber(totalPerformance.profitArea)}
			</div>
		</div>
	}
	
	renderPairsPerformanceList = () => {
		return <div className="PairsPerformanceList">
			{this.getPairPerformanceEntries().map(
				([pairKey, performance], index) => this.renderPairPerformance(pairKey, performance, index)
			)}
		</div>
	};
	
	renderPairPerformance = (pairKey: String, {usdPerformance, profitArea}: SimulationPerformanceModel, index) => {
		let isSelected = this.isPairSelected(pairKey);
		let usdProfit = usdPerformance > 0;
		let areaProfit = profitArea > 0;
		let state = usdProfit !== areaProfit ? "warn" : usdProfit ? "profit" : "loss";
		
		return <div key={pairKey as string} className={`PairPerformance ${isSelected ? "PairPerformance--selected" : ""} PairPerformance--${state}`}>
			<span className="PairPerformance__index">{index}</span>
			<span className="PairPerformance__name">{pairKey}</span>
			<span className="PairPerformance__usd-performance">{formatNumber(usdPerformance)}$</span>
			<span className="PairPerformance__profit-area">{formatNumber(profitArea)}</span>
			<Checkbox
				className="PairPerformance__selector"
				checked={isSelected}
				data-pair-key={pairKey}
				onChange={(nextChecked) => this.handlePairPerformanceSelectorClick(pairKey)}
			/>
		</div>
	};
	
	renderChart() {
		const {selectedPairsKeys} = this.state;
		let chartData = this.getPairPerformanceEntries().filter(([key, perf ]) => selectedPairsKeys.indexOf(key) >=0);
		return <SimulationChart entries={chartData}/>
	}
	
	isPairSelected = (pair: String): boolean => {
		return this.state.selectedPairsKeys.indexOf(pair) >= 0;
	};
	
	handlePairPerformanceSelectorClick = (pairKey) => {
		if (this.isPairSelected(pairKey)) {
			this.setState({selectedPairsKeys: this.state.selectedPairsKeys.filter(item => item !== pairKey)})
		} else {
			this.setState({selectedPairsKeys: this.state.selectedPairsKeys.concat(pairKey)})
		}
	};
	
	private getPairPerformanceEntries = () => {
		const {summary, sortingOrder, sortingMetric} = this.state;
		let sortFunction = sortingMetric === SimulationMetric.USD_PERFORMANCE ? this.sortByUsdPerformance : this.sortByProfitArea;
		if (sortingOrder === SortOrder.DESC) {
			sortFunction = this.desc(sortFunction);
		}
		
		return Array.from(summary.pairPerformances.entries()).sort(sortFunction)
	};
	
	private getSelectedPairsTotalPerformance = (): SimulationPerformanceModel => {
		return this.state.selectedPairsKeys.reduce<SimulationPerformanceModel>((sum, item) =>
				sum.addPerformanceResult(this.state.summary.pairPerformances.get(item) || new SimulationPerformanceModel()),
			new SimulationPerformanceModel()
		);
	};
	
	
	private sortByUsdPerformance = (e1, e2) => e1[1].usdPerformance - e2[1].usdPerformance;
	private sortByProfitArea = (e1, e2) => e1[1].profitArea - e2[1].profitArea;
	private desc = (fn: (e1, e2) => number): ((e1, e2) => number) => (e1, e2) => fn(e1, e2) * -1;
	
}
