export default class SimulationPerformanceModel {
	
	usdPerformance: number;
	profitArea: number;
	
	constructor(usdPerformance?: number, profitArea?: number) {
		this.usdPerformance = usdPerformance || 0;
		this.profitArea = profitArea || 0
	}
	
}
