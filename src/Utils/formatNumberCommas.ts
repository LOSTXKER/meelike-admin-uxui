function formatNumberCommas(x: number): string {
	if (x === undefined) return '0'
	var str = x.toFixed(2).toString().split('.')
	str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return str.join('.')
}

export default formatNumberCommas
