export default class SimulationPerformanceModel {
	
	usdPerformance: number;
	profitArea: number;
	
	constructor(usdPerformance?: number, profitArea?: number) {
		this.usdPerformance = usdPerformance || 0;
		this.profitArea = profitArea || 0
	}
	
	public addPeriodResult = (usdPerformance: number, profitArea: number) => {
		this.usdPerformance += usdPerformance;
		this.profitArea += profitArea;
	};
	
	public addPerformanceResult = (performance: SimulationPerformanceModel) => {
		this.addPeriodResult(performance.usdPerformance, performance.profitArea);
		return this;
	}
	
}
