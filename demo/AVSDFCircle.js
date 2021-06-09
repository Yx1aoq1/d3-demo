const NODE_W = 5
const NODE_H = 5
const NODE_SEPARATION = 60

export default class AVSDFCircle {
  constructor (data, position, nodeSeparation = NODE_SEPARATION) {
    const { nodes, links } = data
    const [ centerX, centerY ] = position
    this.data = data
    this.nodes = nodes
    this.links = links
    this.centerX = centerX
    this.centerY = centerY
    this.nodeSeparation = nodeSeparation
    this.stack = []
    this.initRelationship()
    this.calculateRadius()
    this.layout()
    console.log('AVSDFCircle', this.data)
  }

  layout () {
    this.inOrder = []
    this.currentIndex = 0
    while (this.currentIndex !== this.nodes.length) {
      const node = this.findNodeToPlace()
      this.putInOrder(node)
    }
  }

  initRelationship () {
    this.idToLNode = new Map(this.nodes.map(d => {
      // 默认将位置初始化在图中央
      if (isNaN(d.x)) {
        d.x = 0
      }
      if (isNaN(d.y)) {
        d.y = 0
      }
      d.links = []
      d.index = -1
      return [d.id, d]
    }))

    this.links.map(link => {
      const source = this.idToLNode.get(link.source)
      const target = this.idToLNode.get(link.target)
      
      source.links.push(link)

      if (source.id !== target.id) {
        target.links.push(link)
      }
    })
  }

  calculateRadius () {
    // 点的长宽
    const nodeW = NODE_W
    const nodeH = NODE_H
    // 对角线长度
    this.nodeDiagonal = Math.sqrt(nodeW * nodeW + nodeH * nodeH)
    // 计算一整个圆周的周长
    this.perimeter = this.nodes.length * (this.nodeDiagonal + this.nodeSeparation)
    // 反向推导出需要生成的圆的半径
    this.radius = this.perimeter / ( 2 * Math.PI)
  }

  putInOrder (node) {
    this.inOrder[this.currentIndex] = node
    node.index = this.currentIndex
    if (this.currentIndex === 0) {
      node.angle = 0
    } else {
      node.angle = this.inOrder[this.currentIndex - 1].angle + 2 * Math.PI * (this.nodeDiagonal + this.nodeSeparation) / this.perimeter
    }

    node.x = this.centerX + this.radius * Math.cos(node.angle)
    node.y = this.centerY + this.radius * Math.sin(node.angle)

    this.currentIndex ++
  }

  findNodeToPlace () {
    let sDegreeNode = undefined;
    if (this.stack.length === 0) {
      sDegreeNode = this.findUnorderedSmallestDegreeNode()
      console.log('sDegreeNode', sDegreeNode)
    } else {
      let foundUnorderNode = false
      while (!foundUnorderNode && !(this.stack.length === 0)) {
        sDegreeNode = this.stack.pop()
        foundUnorderNode = !this.isOrdered(sDegreeNode)
      }
      if (foundUnorderNode) {
        sDegreeNode = undefined
      }
    }

    if (sDegreeNode === undefined) {
      sDegreeNode = this.findUnorderedSmallestDegreeNode()
    }

    if (sDegreeNode !== undefined) {
      let neighbors = this.getNeighborsSortedByDegree(sDegreeNode)

      for (let i = neighbors.length - 1; i >= 0 ; i--) {
        let neighbor = neighbors[i]

        if (!this.isOrdered(neighbor)) {
          this.stack.push(neighbor)
        }
      }
    }

    return sDegreeNode
  }

  findUnorderedSmallestDegreeNode () {
    let minDegree = Number.MAX_SAFE_INTEGER
    let sDegreeNode

    this.nodes.forEach(node => {
      if (node.links.length < minDegree && !this.isOrdered(node)) {
        minDegree = node.links.length
        sDegreeNode = node
      }
    })

    return sDegreeNode
  }

  getNeighborsSortedByDegree (node) {
    const neighbors = new Set()
    
    node.links.forEach(link => {
      const source = this.idToLNode.get(link.source)
      const target = this.idToLNode.get(link.target)

      if (source === node) {
        neighbors.add(target)
      }

      if (target === node) {
        neighbors.add(source)
      }
    })

    let result = Array.from(neighbors)

    result = result.filter(node => node.index === -1)

    result.sort((a, b) => {
      return a.links.length - b.links.length
    })

    console.log('neighbors', result)
    return result
  }

  isOrdered (node) {
    return node.index > -1
  }
}