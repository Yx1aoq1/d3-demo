import * as d3 from 'd3'
import * as _ from 'lodash'
export default class D3Topology {
  constructor (options) {
    const defaultOptions = {
      width: 500,
      height: 500
    }

    this.options = Object.assign(defaultOptions, options)
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
  }

  initContainer () {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
    
    this.zoom = this.svg.append('g')
      .attr('class', 'topology__zoom')
  }

  render () {
    // 节点图标后面创建，可以遮挡图标上面的连接线
    this.initForceSimulation()
    this.createLinks()
    this.createNodes()
  }

  initForceSimulation () {
    this.simulation = d3.forceSimulation(this._nodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(this._links).id(d => d.id))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', this.ticked.bind(this))
  }

  ticked () {
    this.link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      
    this.node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
  }

  createLinks () {
    this.link = this.zoom.selectAll('g.line')
      .data(this._links)
      .enter()
      .append('g')
      .append('line')
      .attr('class', 'topology__link')
      .attr('stroke', '#93c62d')
      .attr('stroke-width', 2)
    
    this.rect = this.link.append('rect')
      .attr('fill', '#555')
      .attr('width', 2)
      .attr('height', 2)
      .append('animate')
    
    this.link.select('rect')
      .attr('x', d => d.source.x - 1)
      .attr('y', d => d.source.y - 1)
      .selectAll('animate')
      .each(function (d, i) {
        if (i == 0) {
          d3.select(this)
            .attr('attributeName', 'x')
            .attr('from', d => d.source.x - 1)
            .attr('to', d => d.target.x)
        }
        d3.select(this)
          .attr('attributeType', 'XML')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite')
      })
  }

  createNodes () {
    this.node = this.zoom.selectAll('g.topology__node')
      .data(this._nodes)
      .enter()
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('class', 'topology__node')
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#000')
  }
}