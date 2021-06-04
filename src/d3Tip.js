import {
  noop,
  proxy
} from './utils'

const defaultOptions = {
  rootElement: document.body,
  html: d => d.id,
  placement: 'top'
}


export default class D3Tip {
  constructor (topo, options) {
    this.topo = topo
    this.svg = topo.svg
    this.element = this.initElement()
    this.point = this.svg.node().createSVGPoint()
    this.options = _.merge(defaultOptions, options)
    this.proxyOptions()
  }

  /**
   * 将options的属性代理到this上
   * 可以通过this.xxx直接取到options上的值
   */
  proxyOptions () {
    const keys = Object.keys(this.options)
    let i = keys.length
    while (i--) {
      const key = keys[i]
      proxy(this, `options`, key)
    }
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
      ['top', this.topPosition],
      ['bottom', this.bottomPosition],
      ['left', this.leftPosition],
      ['right', this.rightPosition]
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

  bottomPosition (target) {
    const matrix = target.getScreenCTM()
    const nodeBox = target.getBBox()
    const transBox = this.point.matrixTransform(matrix)
    const elemW = this.element.offsetWidth
    const elemH = this.element.offsetHeight

    return {
      y: transBox.y + nodeBox.height,
      x: transBox.x - (elemW / 2 - nodeBox.x / 2)
    }
  }

  leftPosition (target) {
    const matrix = target.getScreenCTM()
    const nodeBox = target.getBBox()
    const transBox = this.point.matrixTransform(matrix)
    const elemW = this.element.offsetWidth
    const elemH = this.element.offsetHeight

    return {
      y: transBox.y - elemH / 2,
      x: transBox.x - (elemW + nodeBox.width)
    }
  }

  rightPosition (target) {
    const matrix = target.getScreenCTM()
    const nodeBox = target.getBBox()
    const transBox = this.point.matrixTransform(matrix)
    const elemW = this.element.offsetWidth
    const elemH = this.element.offsetHeight

    return {
      y: transBox.y - elemH / 2,
      x: transBox.x + nodeBox.width
    }
  }
}