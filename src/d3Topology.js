import * as d3 from 'd3'

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
  }

  init () {
    this.render(this.data)
  }

  render ({ nodes, links }) {
    this.svg = d3.select(this.container).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    const link = this.svg.append('g')
      .attr('stroke', '#999')
      .attr("stroke-opacity", 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2)

    const node = this.svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', '#000')
  }
}