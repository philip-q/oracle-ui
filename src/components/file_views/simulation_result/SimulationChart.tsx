import React from "react";
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import SimulationPerformanceModel from "../../../models/SimulationPerformanceModel";
import {SimulationMetric} from "../../../models/enumerations/SimulationMetric";

interface SimulationChartState {
	shownMetrics: SimulationMetric[];
}


interface SimulationChartProps {
	entries: Array<[String, SimulationPerformanceModel]>;
	onBarClick: (pairName: string) => void;
}

export default class SimulationChart extends React.Component<SimulationChartProps, SimulationChartState> {
	
	constructor(props) {
		super(props);
		
		this.state = {
			shownMetrics: [SimulationMetric.USD_PERFORMANCE, SimulationMetric.PROFIT_AREA]
		}
	}
	
	render() {
		return <div className="SimulationChart">
			{this.renderMetricButtons()}
			{this.renderChart()}
		</div>;
	}
	
	renderMetricButtons() {
		return <div className="SimulationChart__metrics">
			<span>Show metrics:</span>
			{this.renderMetricButton(SimulationMetric.USD_PERFORMANCE, "fa-dollar-sign")}
			{this.renderMetricButton(SimulationMetric.PROFIT_AREA, "fa-chart-area")}
		</div>
	}
	
	renderMetricButton(metric: SimulationMetric, iconName: string) {
		return <span
			className={`SimulationChart__metric ${this.isMetricShown(metric) ? "SimulationChart__metric--shown" : ""}`}
			onClick={() => this.toggleMetricVisibility(metric)}
		>
				<i className={`fas ${iconName}`}/>
		</span>
	}
	
	renderChart() {
		let data = this.prepareData();
		let length = Object.keys(data).length;
		return <BarChart data={data} layout="vertical" margin={{top: 10, right: 40, left:50, bottom: 5}} height={length * 15} width={500} barGap={5}
										 barCategoryGap={5} onClick={(barElement) => this.props.onBarClick(barElement.activeLabel)}>
			<XAxis type="number"/>
			<YAxis type="category" dataKey={"label"} tick={{fontSize: 13}} interval={0}/>
			<CartesianGrid/>
			<Tooltip cursor={{strokeDasharray: '3 3'}}/>
			{this.isMetricShown(SimulationMetric.USD_PERFORMANCE) && <Bar type="monotone" dataKey="performance" fill="#8884d8" barSize={5}/>}
			{this.isMetricShown(SimulationMetric.PROFIT_AREA) && <Bar type="monotone" dataKey="area" fill="#2ecc71" barSize={5}/>}
		</BarChart>
	}
	
	toggleMetricVisibility(metric: SimulationMetric) {
		const {shownMetrics} = this.state;
		if (this.isMetricShown(metric)) {
			this.setState({shownMetrics: shownMetrics.filter(m => m !== metric)})
		} else {
			this.setState({shownMetrics: shownMetrics.concat(metric)})
		}
	}
	
	prepareData = () => {
		const {entries} = this.props;
		let absProfitAreas = entries.map(([label, {profitArea}]) => Math.abs(profitArea));
		let absUsd = entries.map(([label, {usdPerformance}]) => Math.abs(usdPerformance));
		let maxAbsProfitArea = Math.max.apply(null, absProfitAreas);
		let maxAbsUsd = Math.max.apply(null, absUsd);
		let normFactor = maxAbsProfitArea / maxAbsUsd;
		
		return entries.map(([label, performance], index) => {
			return {
				label,
				index,
				area: performance.profitArea / normFactor,
				performance: Number(performance.usdPerformance.toFixed(2))
			}
		})
	};
	
	isMetricShown = (metric: SimulationMetric):boolean => {
		return this.state.shownMetrics.indexOf(metric) >= 0
	}
	
}
