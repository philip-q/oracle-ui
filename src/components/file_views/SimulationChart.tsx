import React from "react";
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, LabelList, Tooltip, Legend, Label, Bar, BarChart, ResponsiveContainer} from "recharts";
import SimulationsSummary from "../../models/SimulationSummaryModel";
import {SimulationMetric} from "../../models/enumerations/SimulationMetric";
import {SortOrder} from "../../models/enumerations/SortOrder";
import SimulationPerformanceModel from "../../models/SimulationPerformanceModel";

const data = [
	{x: 100, y: 200, z: 200}, {x: 120, y: 100, z: 260},
	{x: 170, y: 300, z: 400}, {x: 140, y: 250, z: 280},
	{x: 150, y: 400, z: 500}, {x: 110, y: 280, z: 200}];

interface SimulationChartProps {
	entries: Array<[String, SimulationPerformanceModel]>;
}

export default class SimulationChart extends React.Component<SimulationChartProps, any> {
	
	render() {
		let data = this.prepareData(); // .filter((element, index) => index < 5);
		return <div className="SimulationChart">
			<BarChart width={1400} height={400} data={data}>
				<XAxis interval={0} dataKey="label" height={60}/>
				<YAxis />
				<CartesianGrid/>
				<Tooltip cursor={{strokeDasharray: '3 3'}}/>
				<Bar type="monotone" dataKey="performance" fill="#8884d8" barSize={40}>
					{/*<LabelList dataKey="label" position="insideTop" angle="-90"  />*/}
				</Bar>
			</BarChart>
		</div>;
	}
	
	prepareData = () => {
		const {entries} = this.props;
		return entries.map(([label, performance], index) => {
			return {label, index, performance: Number(performance.usdPerformance.toFixed(2))}
		})
	}
}
