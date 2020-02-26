import React from "react";
import SimulationPerformanceModel from "../../../models/SimulationPerformanceModel";
import SimulationChart from "./SimulationChart";
import SimulationsSummary from "../../../models/SimulationSummaryModel";
import {SimulationMetric} from "../../../models/enumerations/SimulationMetric";
import {SortOrder} from "../../../models/enumerations/SortOrder";
import {formatNumber} from "../../../util/formatting";
import Checkbox from "../../Checkbox";

interface TotalPairsSimulationProgressProps {
	summary: SimulationsSummary;
	selectedPairsKeys: Array<String>;
	onChartBarClick: (pairKey: string) => void;
	onCurrencyPairCheck: (pairKey: string) => void;
}

interface TotalPairsSimulationProgressState {
	sortingMetric: SimulationMetric;
	sortingOrder: SortOrder;
}

export default class TotalPairsSimulationProgress extends React.Component<TotalPairsSimulationProgressProps, TotalPairsSimulationProgressState> {
	
	constructor(props: TotalPairsSimulationProgressProps) {
		super(props);
		
		this.state = {
			sortingMetric: SimulationMetric.USD_PERFORMANCE,
			sortingOrder: SortOrder.DESC
		}
	}
	
	render() {
		return <div className="TotalPairsSimulationProgress">
			<div className="TotalPairsSimulationProgress__sorting-buttons">
				{this.renderSortingButtons()}
			</div>
			
			<div className="TotalPairsSimulationProgress__content">
				{this.renderChart()}
				{this.renderPairsPerformanceList()}
			</div>
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
			onClick={() => this.setState({sortingMetric: metric})}
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
	
	renderChart() {
		const {selectedPairsKeys, onChartBarClick} = this.props;
		let chartData = this.getPairPerformanceEntries().filter(([key, perf]) => selectedPairsKeys.indexOf(key) >= 0);
		return <SimulationChart entries={chartData} onBarClick={onChartBarClick}/>
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
				onChange={() => this.props.onCurrencyPairCheck(pairKey as string)}
			/>
		</div>
	};
	
	
	
	private getPairPerformanceEntries = () => {
		const {sortingOrder, sortingMetric} = this.state;
		let sortFunction = sortingMetric === SimulationMetric.USD_PERFORMANCE ? this.sortByUsdPerformance : this.sortByProfitArea;
		if (sortingOrder === SortOrder.DESC) {
			sortFunction = this.desc(sortFunction);
		}
		
		return Array.from(this.props.summary.totalPairPerformances.entries()).sort(sortFunction)
	};
	
	isPairSelected = (pair: String): boolean => {
		return this.props.selectedPairsKeys.indexOf(pair) >= 0;
	};
	
	private sortByUsdPerformance = (e1, e2) => e1[1].usdPerformance - e2[1].usdPerformance;
	private sortByProfitArea = (e1, e2) => e1[1].profitArea - e2[1].profitArea;
	private desc = (fn: (e1, e2) => number): ((e1, e2) => number) => (e1, e2) => fn(e1, e2) * -1;
	
}