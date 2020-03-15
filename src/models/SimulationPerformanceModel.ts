export default class SimulationPerformanceModel {
	
	usdPerformance: number;
	profitArea: number;
	pipError: number;
	
	constructor(usdPerformance?: number, profitArea?: number, pipError?: number) {
		this.usdPerformance = usdPerformance || 0;
		this.profitArea = profitArea || 0;
		this.pipError = pipError || 0;
	}
	
}
