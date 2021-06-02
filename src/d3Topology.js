import { container } from 'webpack'
import {
  noop,
  proxy
} from './utils'

const defaultOptions = {
  container: 'body',
  width: 500,
  height: 500,
  animate: false,
  scale: true,
  dragable: true,
  data: {
    nodes: [],
    links: []
  },
  distance: 90,
  alpha: 0.3,
  inited: noop,
  ticked: noop,
  createLayers: noop,
  createLinks: noop,
  createNodes: noop
}
export default class D3Topology {
  constructor (options) {
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

  init () {
    this.initContainer()
    this.initForceSimulation()
    this.inited.call(this)
    this.render()
  }

  initContainer () {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'topology__svg')
    
    this.zoom = this.svg.append('g')
      .attr('class', 'topology__zoom')
  }

  initForceSimulation () {
    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('link',  d3.forceLink().id(d => d.id).distance(this.distance))
      .on('tick', this.ticked.bind(this))
  }

  render () {
    this.update(this.data)
  }

  update ({ nodes, links }) {
    const context = this
    // 清除画布
    this.clear()
    // 更新数据
    this._nodes = _.cloneDeep(nodes)
    this._links = _.cloneDeep(links)
    // 设置数据
    this.simulation.nodes(this._nodes)
    this.simulation.force('link').links(this._links)
    // node后绘制确保覆盖在线上
    this.layers = this.createLayers.call(this, this.zoom)
    this.links = this.createLinks.call(this, this.zoom, this._links)
    this.nodes = this.createNodes.call(this, this.zoom, this._nodes)

    this.attachEvent()
    if (this.animate) {
      this.simulation.alphaTarget(this.alpha).restart()
    } else {
      this.ticked.call(this)
    }
  }

  attachEvent () {
    // zoom 缩放功能
    this.scale && this.initZoomBehavior(this.scale)
    // 拖拽节点
    this.dragable && this.initDragBehavior()
  }

  initZoomBehavior (scale) {
    if (typeof scale ==='boolean') {
      scale = [1, 10]
    }
    const zoom = d3.zoom().scaleExtent(scale).on('zoom', (event) => {
      this.zoom.attr('transform', event.transform)
    })

    this.svg.call(zoom)
  }

  initDragBehavior () {
    this.nodes.call(this.drag(this.simulation))
  }

  drag (simulation) {
    const self = this

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }
    
    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y

      if (!self.animate) {
        self.ticked()
      }
    }
    
    function dragended(event, d) {
      if (!self.animate) {
        d.fx = event.x
        d.fy = event.y
      } else {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  clear () {
    this.layers && this.layers.remove()
    this.links && this.links.remove()
    this.nodes && this.nodes.remove()
  }
}