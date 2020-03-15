import React from "react";
import {Bar, BarChart, CartesianGrid, Tooltip} from "recharts";
import SimulationPerformanceModel from "../../../models/SimulationPerformanceModel";

interface PairSimulationProgressProps {
	progress: Map<number, SimulationPerformanceModel>;
}

export default class PairSimulationProgress extends React.Component<PairSimulationProgressProps> {
	
	render() {
		return <div className="PairSimulationProgress">
			{this.renderChart()}
		</div>
	}
	
	renderChart() {
		let data = this.prepareData();
		return <BarChart data={data} margin={{top: 10, right: 10, left: 10, bottom: 10}} height={400} width={1200} barGap={5}
										 barCategoryGap={5} onClick={(barElement) => console.log(barElement.activePayload[0].payload)}>
			<CartesianGrid/>
			<Tooltip cursor={{strokeDasharray: '3 3'}} formatter={this.formatTooltip}/>
			<Bar type="monotone" dataKey="performance" fill="#8884d8" barSize={5}/>
			{/*<Bar type="monotone" dataKey="area" fill="#2ecc71" barSize={5}/>*/}
		</BarChart>
	}
	
	formatTooltip = (value, name, {payload: {start, performance, area, pipError}}) => {
		return [`\nstart: ${start} \nperformance: ${performance.toFixed(2)}$ \narea: ${area.toFixed(2)} \npip error: ${pipError}`, "Period performance"]
	};
	
	prepareData = () => {
		const {progress} = this.props;
		
		let progressEntries = Array.from(progress.entries()).sort();
		let absProfitAreas = progressEntries.map(([k, {profitArea}]) => Math.abs(profitArea));
		let absUsd = progressEntries.map(([k, {usdPerformance}]) => Math.abs(usdPerformance));
		let maxAbsProfitArea = Math.max.apply(null, absProfitAreas);
		let maxAbsUsd = Math.max.apply(null, absUsd);
		let normFactor = maxAbsProfitArea / maxAbsUsd;
		
		return progressEntries.map(([start, performance], index) => {
			return {
				start,
				area: performance.profitArea / normFactor,
				performance: Number(performance.usdPerformance.toFixed(2)),
				pipError: Number(performance.pipError)
			}
		})
	};
	
}