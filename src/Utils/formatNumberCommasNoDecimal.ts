function formatNumberCommasNoDecimal(x: number | string): string {
	if (x === undefined || x === null) return '0'

	// Convert to number if it's a string
	const num = typeof x === 'string' ? parseFloat(x) : x

	// Remove decimal part and add commas
	const formattedNum = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

	return formattedNum
}

export default formatNumberCommasNoDecimal
