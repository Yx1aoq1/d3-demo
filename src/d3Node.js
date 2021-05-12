const defaultOptions = {
  custom: false,
  type: 'circle',
  r: 5,
  color: '#333',
  showLabel: false,
  labelStyle: {
    position: {
      x: 8,
      y: '0.31em'
    },
    fontSize: 12,
    color: '#333'
  },
  labelText: d => d.id,
  customLable: null
}

export default class D3Node {
  constructor (options) {
    this.options = _.merge(defaultOptions, options)
    this.custom = this.options.custom
    this.type = this.options.type
    this.showLabel = this.options.showLabel
  }

  draw (nodes) {
    if (this.custom && typeof this.custom === 'function') {
      this.custom(nodes)
      return
    }

    const drawStrategies = new Map([
      ['circle', this.drawCircle]
    ])

    return drawStrategies.get(this.type).call(this, nodes)
  }

  drawLabel (nodes) {
    const text = nodes.append('text')
    const { labelStyle, labelText, customLable } = this.options
    if (customLable && typeof customLable === 'function') {
      customLable(text)
      return
    }
    text
      .attr('x', labelStyle.position.x)
      .attr('y', labelStyle.position.y)
      .text(labelText)
      .style('font-size', labelStyle.fontSize)
      .style('fill', labelStyle.color)
  }

  drawCircle (nodes) {
    const { r, color } = this.options

    const node = nodes.append('circle')
      .attr('r', r)
      .attr('fill', color)
    
    this.showLabel && this.drawLabel(nodes)
    return node
  }
}