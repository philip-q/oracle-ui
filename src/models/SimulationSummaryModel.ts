import FileModel from "./FileModel";
import {currencyPairKey} from "../util/naming";
import SimulationPerformanceModel from "./SimulationPerformanceModel";

export default class SimulationsSummary {
	pairPerformances: Map<String, SimulationPerformanceModel>;
	
	constructor(file: FileModel) {
		this.pairPerformances = new Map<String, SimulationPerformanceModel>();
		this.calculateSummary(file);
	}
	
	public setCurrencyPairPerformance(base: string, quote: string, performance: SimulationPerformanceModel) {
		this.pairPerformances.set(currencyPairKey(base, quote), performance);
	}
	
	private calculateSummary(file: FileModel) {
		for (let base of Object.keys(file.content)) {
			for (let quote of Object.keys(file.content[base])) {
				
				let pairPerformance = new SimulationPerformanceModel();
				
				for (let simulationPeriodStart of Object.keys(file.content[base][quote])) {
					let periodResult = file.content[base][quote][simulationPeriodStart];
					pairPerformance.addPeriodResult(periodResult.usd_performance, periodResult.profit_area)
				}
				
				this.setCurrencyPairPerformance(base, quote, pairPerformance)
			}
		}
	}
	
}
