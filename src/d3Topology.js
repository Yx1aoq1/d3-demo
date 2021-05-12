import D3Line from './d3Line'
import D3Node from './d3Node'

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
  nodeConfig: {},
  lineConfig: {},
  distance: 90
}
export default class D3Topology {
  constructor (options) {
    this.options = _.merge(defaultOptions, options)

    this.width = this.options.width
    this.height = this.options.height
    this.data = this.options.data
    this.container = this.options.container
    this.animate = this.options.animate

    this.d3Node = new D3Node(this.options.nodeConfig)
    this.d3Line = new D3Line(this.options.lineConfig)

    const { nodes, links } = this.data
    this._nodes = _.cloneDeep(nodes)
    this._links = _.cloneDeep(links)
  }

  init () {
    this.initContainer()
    this.render()
    this.attachEvent()
  }

  initContainer () {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'topology__svg')
    
    this.zoom = this.svg.append('g')
      .attr('class', 'topology__zoom')
  }

  render () {
    this.initForceSimulation()
    // 节点图标后面创建，可以遮挡图标上面的连接线
    this.createLinks()
    this.createNodes()
    this.ticked()
  }

  initForceSimulation () {
    this.simulation = d3.forceSimulation()
      .nodes(this._nodes)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('link',  d3.forceLink(this._links).id(d => d.id))
      .on('tick', this.ticked.bind(this))

    if (!this.animate) {
      this.simulation.stop()
    }
  }

  ticked () {
    this.links
      .select('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      
    this.nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('transform', d => `translate(${d.x},${d.y})`)
  }

  createLinks () {
    this.links = this.zoom.selectAll('g.topology__link')
      .data(this._links)
      .enter()
      .append('g')
      .attr('class', 'topology__link')

    
    this.d3Line.draw(this.links)
  }

  createNodes () {
    this.nodes = this.zoom.selectAll('g.topology__node')
      .data(this._nodes)
      .enter()
      .append('g')
      .attr('class', 'topology__node')
    
    this.d3Node.draw(this.nodes)
  }

  attachEvent () {
    const { scale, dragable } = this.options

    scale && this.initZoomBehavior(scale)
    dragable && this.initDragBehavior()
    // tooltip
    this.nodes.on('mouseenter', function () {
      d3.select(this).style('cursor', 'pointer')
    })
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
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }
    
    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }
}