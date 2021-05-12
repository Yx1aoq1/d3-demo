const defaultOptions = {
  container: 'body',
  width: 500,
  height: 500,
  data: {
    nodes: [],
    links: []
  },
  distance: 90,
  node: {
    custom: false,
    r: 6,
    color: '#000'
  },
  nodeText: null
}
export default class D3Topology {
  constructor (options) {
    this.options = _.merge(defaultOptions, options)
    this.width = this.options.width
    this.height = this.options.height
    this.data = this.options.data
    this.container = this.options.container

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
  }

  initForceSimulation () {
    this.simulation = d3.forceSimulation(this._nodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(this._links).id(d => d.id).distance(this.options.distance))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', this.ticked.bind(this))
  }

  ticked () {
    this.links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      
    this.nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('transform', d => `translate(${d.x},${d.y})`)
    
    this.linksEnter.select('rect')
      .attr('x', d => d.source.x - 1)
      .attr('y', d => d.source.y - 1)
      .selectAll('animate')
      .each(function (d, i) {
        const axis = ['x', 'y'][i]
        d3.select(this)
          .attr('attributeName', axis)
          .attr('from', d => d.source[axis] - 1)
          .attr('to', d => d.target[axis])
          .attr('attributeType', 'XML')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite')
      })
  }

  createLinks () {
    this.linksEnter = this.zoom.selectAll('g.topology__link')
      .data(this._links)
      .enter()
      .append('g')
      .attr('class', 'topology__link')
    
    this.links = this.linksEnter.append('line')
      .attr('stroke', '#93c62d')
      .attr('stroke-width', 2)
    // 添加移动方向动画
    const rect = this.linksEnter.append('rect')
      .attr('fill', '#555')
      .attr('width', 2)
      .attr('height', 2)
    rect.append('animate')
    rect.append('animate')
  }

  createNodes () {
    this.nodes = this.zoom.selectAll('g.topology__node')
      .data(this._nodes)
      .enter()
      .append('g')
      .attr('class', 'topology__node')
    
    this.drawNode()
  }

  drawNode () {
    const { node, nodeText } = this.options
    // custom node style
    if (node.custom && typeof node.custom === 'function') {
      node.custom(this.nodes)
      return
    }
    // default node style
    this.nodes.append('circle')
      .attr('r', node.r)
      .attr('fill', node.color)

    if (nodeText) {
      const text = this.nodes.append('text')

      if (typeof nodeText === 'function') {
        // custom node text
        nodeText(text)
      } else if (_.isObject(nodeText)) {
        // node text options
        text
          .attr('x', nodeText.position?.x || 8)
          .attr('y', nodeText.position?.y || '0.31em')
          .text(nodeText.text)
          .style('font-size', nodeText.fontSize || '12')
          .style('fill', nodeText.color || '#333')
      }
    }
  }

  attachEvent () {
    this.initZoomBehavior()
    this.initDragBehavior()
    // tooltip
    this.nodes.on('mouseenter', function () {
      d3.select(this).style('cursor', 'pointer')
    })
  }

  initZoomBehavior () {
  }

  initDragBehavior () {
  }
}