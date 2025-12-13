export function formatNumberAbbreviation(value: number): string {
	if (value < 1e3) return String(value)
	if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(1) + 'K'
	if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(1) + 'M'
	if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(1) + 'B'
	if (value >= 1e12) return +(value / 1e12).toFixed(1) + 'T'

	return ''
}
