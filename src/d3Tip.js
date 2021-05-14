const defaultOptions = {
  show: true,
  rootElement: document.body,
  html: d => d.id,
  placement: 'top'
}


export default class D3Tip {
  constructor (svg, options) {
    this.svg = svg
    this.options = _.merge(defaultOptions, options)
    this.element = this.initElement()
    this.rootElement = this.options.rootElement
    this.html = this.options.html
    this.placement = this.options.placement
    this.point = this.svg.node().createSVGPoint()
  }

  initElement () {
    const div = d3.select(document.createElement('div'))
    div
      .style('position', 'absolute')
      .style('top', 0)
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('box-sizing', 'border-box')
      .classed('topology__tooltip', true)
    
    return div.node()
  }

  init () {
    this.rootElement.appendChild(this.element)
    this.node = d3.select(this.element)
  }

  show () {
    const [event, d, target] = [...arguments]
    const content = this.html.call(this, d)
    
    this.node
      .html(content)
      .classed(`topology__tooltip-${this.placement}`, true)
    // set position
    const position = this.position(target)
    this.node
      .style('top', position.y + 'px')
      .style('left', position.x + 'px')
      .style('pointer-events', 'all')
      .style('opacity', 1)
      
  }

  hide () {
    this.node
      .html('')
      .style('opacity', 0)
      .style('pointer-events', 'all')
  }

  position (target) {
    // 根据不同的type设置绘制节点
    const placementStrategies = new Map([
      ['top', this.topPosition]
    ])

    return placementStrategies.get(this.placement).call(this, target)
  }

  topPosition (target) {
    const matrix = target.getScreenCTM()
    const nodeBox = target.getBBox()
    const transBox = this.point.matrixTransform(matrix)
    const elemW = this.element.offsetWidth
    const elemH = this.element.offsetHeight

    return {
      y: transBox.y - (elemH + nodeBox.height),
      x: transBox.x - (elemW / 2 - nodeBox.x / 2)
    }
  }
}