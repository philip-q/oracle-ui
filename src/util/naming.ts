export const currencyPairKey = (base: string, quote: string): string => {
	return `${base}_${quote}`;
};
