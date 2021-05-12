const defaultOptions = {
  custom: false,
  type: 'circle',
  r: 5,
  color: '#333'
}

export default class D3Node {
  constructor (options) {
    this.options = options
    this.custom = this.options.custom || false
    this.type = this.options.type || 'circle'
  }

  draw (nodes) {
    if (this.custom && typeof this.custom === 'function') {
      this.custom(nodes)
      return
    }

    const drawStrategies = new Map([
      ['circle', this.drawCircle]
    ])

    drawStrategies.get(this.type).call(this, nodes)
  }

  drawCircle (nodes) {
    const { r, color } = this.options
    nodes.append('circle')
      .attr('r', r)
      .attr('fill', color)
  }
}