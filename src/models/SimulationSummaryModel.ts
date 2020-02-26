import FileModel from "./FileModel";
import {currencyPairKey} from "../util/naming";
import SimulationPerformanceModel from "./SimulationPerformanceModel";

export default class SimulationsSummary {
	totalPairPerformances: Map<String, SimulationPerformanceModel>;
	pairPeriodPerformances: Map<String, Map<number, SimulationPerformanceModel>>;
	
	constructor(file: FileModel) {
		this.totalPairPerformances = new Map<String, SimulationPerformanceModel>();
		this.pairPeriodPerformances = new Map<String, Map<number, SimulationPerformanceModel>>();
		this.calculateSummary(file);
	}
	
	private calculateSummary(file: FileModel) {
		for (let base of Object.keys(file.content)) {
			for (let quote of Object.keys(file.content[base])) {
				
				let totalUsd = 0;
				let totalProfitArea = 0;
				let pairPeriodPerformances = new Map<number, SimulationPerformanceModel>();

				for (let simulationPeriodStart of Object.keys(file.content[base][quote]).sort()) {
					const {usd_performance, profit_area} = file.content[base][quote][simulationPeriodStart];
					totalUsd += usd_performance;
					totalProfitArea += profit_area;
					pairPeriodPerformances.set(Number(simulationPeriodStart), new SimulationPerformanceModel(usd_performance, profit_area));
				}
				
				let key = currencyPairKey(base, quote);
				this.totalPairPerformances.set(key, new SimulationPerformanceModel(totalUsd, totalProfitArea));
				this.pairPeriodPerformances.set(key, pairPeriodPerformances);
			}
		}
	}
	
}
