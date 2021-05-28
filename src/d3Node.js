
import D3Tip from './d3Tip'

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
  customLable: null,
  tooltip: {
    show: false
  }
}

export default class D3Node {
  constructor (svg, options) {
    this.svg = svg
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
    // 根据不同的type设置绘制节点
    const drawStrategies = new Map([
      ['circle', this.drawCircle]
    ])
    this.node = drawStrategies.get(this.type).call(this, nodes)
    // 绑定事件
    this.attachEvent()
    return this.node
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

  attachEvent () {
    const self = this
    const showTooltip = !!this.options.tooltip.show

    showTooltip && this.initTooltip()

    this.node.on('mouseenter', function () {
      d3.select(this).style('cursor', 'pointer')
      showTooltip && self.nodeTip.show(...arguments, this)
    })

    this.node.on('mouseout', function() {
      showTooltip && self.nodeTip.hide(...arguments, this)
    })
  }

  initTooltip () {
    this.nodeTip = new D3Tip(this.svg, this.options.tooltip)
    this.nodeTip.init()
  }
}