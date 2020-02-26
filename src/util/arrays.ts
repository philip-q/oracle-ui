export const getNeighbourItems = <T>(item:T, array: Array<T>) => {
	let currentIndex = Math.max(array.indexOf(item), 0);
	let nextIndex = currentIndex < array.length - 2 ? currentIndex + 1 : 0;
	let prevIndex = currentIndex > 0 ? currentIndex - 1 : array.length - 1;
	return {next: array[nextIndex], prev: array[prevIndex]}
};