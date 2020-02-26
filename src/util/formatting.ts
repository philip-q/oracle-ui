export const formatNumber = (number: Number) => number.toFixed(2);

export const displayedSimulationPath = (sourcePath: string): string => {
	return sourcePath.slice(sourcePath.indexOf("simulations") + "simulations/".length);
};

export const getEpochFromPath = (path: string): number => {
	let match = path.match(/.*\/((\d+)_\d+).*/);
	return match ? Number(match[2]) : -404;
};
