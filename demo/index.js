import { D3Topology } from '../src'

function createNode (id) {
  return {
    id
  }
}

function createLink (source, target) {
  return {
    source,
    target
  }
}

function createTopoDatas (nodeNum, linkNum) {
  const nodes = new Array(nodeNum)

  for(let i = 0;i < nodeNum; i++) {
    nodes[i] = createNode(i)
  }

  const links = new Array(linkNum)
  const end = nodeNum - 1
  for(let i = 0;i < linkNum; i++) {
    links[i] = createLink(_.random(0, end), _.random(0, end))
  }

  const data = { nodes, links }
  console.log('data', data)
  return data
}

const data = createTopoDatas(10, 15)

let topo_nodes
let topo_links
const tp = new D3Topology({
  data,
  container: '#topo-container',
  height: 700,
  width: 1000,
  animate: true,
  distance: 200,
  ticked () {
    topo_links
      .select('path')
      .attr('d', d => {
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      })

    topo_nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('transform', d => `translate(${d.x},${d.y})`)
  },
  createLinks (container, links) {
    topo_links = container.selectAll('g.topology__link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'topology__link')
    
    topo_links
      .append('path')
      .style('fill','none')
      .style('stroke', '#ccc')
      .style('stroke-width', 2)

    return topo_links
  },
  createNodes (container, nodes) {
    topo_nodes = container.selectAll('g.topology__node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'topology__node')
    
    topo_nodes.append('circle')
      .attr('r', 5)
      .attr('fill', '#333')

    return topo_nodes
  }
})

tp.init()

const updateBtn = document.getElementById('update-btn')

updateBtn.addEventListener('click', event => {
  tp.update(createTopoDatas(10, 15))
})