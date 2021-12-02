const defaultOptions = {
	custom: false,
	type: 'solid',
	width: 2,
	color: '#ccc'
}

export default class D3Line {
	constructor (svg, options) {
		this.svg = svg
		this.options = _.merge(defaultOptions, options)
		this.custom = this.options.custom || false
		this.type = this.options.type || 'circle'
	}

	draw (links) {
		if (this.custom && typeof this.custom === 'function') {
			this.custom(links)
			return
		}

		const drawStrategies = new Map([ [ 'solid', this.drawSolidLine ], [ 'curve', this.drawCurveLine ] ])

		return drawStrategies.get(this.type).call(this, links)
	}

	drawSolidLine (links) {
		const { width, color } = this.options
		return links.append('path').attr('stroke', color).attr('stroke-width', width)
	}

	drawCurveLine (links) {
		const { width, color } = this.options
		return links.append('path').style('fill', 'none').style('stroke', color).style('stroke-width', width)
	}

	ticked () {}
}
