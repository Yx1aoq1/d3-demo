import { D3Topology, D3Tip } from '../src'

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

/**
 * 圆形分布位置生成算法
 * @param {*} data 点数据集
 * @param {*} position 中心位置 [x, y]
 * @param {*} nodeSeparation 点与点之间的距离
 */
function setCirclePosition (data, position, nodeSeparation = 60) {
  const { nodes, links } = data
  const [ centerX, centerY ] = position
  // 点的长宽
  const nodeW = 5
  const nodeH = 5
  // 对角线长度
  const nodeDiagonal = Math.sqrt(nodeW * nodeW + nodeH * nodeH)
  // 计算一整个圆周的周长
  const perimeter = nodes.length * (nodeDiagonal + nodeSeparation)
  // 反向推导出需要生成的圆的半径
  const radius = perimeter / ( 2 * Math.PI)

  nodes.map((node, idx) => {
    if (idx === 0) {
      node.angle = 0
    } else {
      node.angle = nodes[idx - 1].angle + 2 * Math.PI * (nodeDiagonal + nodeSeparation) / perimeter
    }

    node.x = centerX + radius * Math.cos(node.angle)
    node.y = centerY + radius * Math.sin(node.angle)
  })

  console.log(nodes)
}

setCirclePosition(data, [1000 / 2, 700 / 2])

let topo_nodes
let topo_links
let topo_tooltip
const tp = new D3Topology({
  data,
  container: '#topo-container',
  height: 700,
  width: 1000,
  animate: false,
  distance: 200,
  inited () {
    topo_tooltip = new D3Tip(this, {})
    topo_tooltip.init()
  },
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
  },
  bindEvents () {
    const self = this
    topo_nodes.on('mouseenter', function () {
      d3.select(this).style('cursor', 'pointer')
      !self.dragging && topo_tooltip.show(...arguments, this)
    })

    topo_nodes.on('mouseout', function() {
      topo_tooltip.hide(...arguments, this)
    })
  }
})

tp.init()

const updateBtn = document.getElementById('update-btn')

updateBtn.addEventListener('click', event => {
  const data = createTopoDatas(20, 30)
  setCirclePosition(data, [1000 / 2, 700 / 2])
  tp.update(data)
})