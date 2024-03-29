import { D3Topology, D3Tip } from '../src'
import AVSDFCircle from './AVSDFCircle'

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

	for (let i = 0; i < nodeNum; i++) {
		nodes[i] = createNode(i)
	}

	const links = new Array(linkNum)
	const end = nodeNum - 1
	for (let i = 0; i < linkNum; i++) {
		links[i] = createLink(_.random(0, end), _.random(0, end))
	}

	const data = { nodes, links }
	console.log('data', data)
	return data
}

const data = createTopoDatas(10, 15)

const circle = new AVSDFCircle(data, [ 1000 / 2, 700 / 2 ])
circle.layout()

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
		topo_links.select('path').attr('d', d => {
			return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
		})

		topo_nodes.attr('cx', d => d.x).attr('cy', d => d.y).attr('transform', d => `translate(${d.x},${d.y})`)
	},
	createLinks (container, links) {
		topo_links = container
			.selectAll('g.topology__link')
			.data(links)
			.enter()
			.append('g')
			.attr('class', 'topology__link')

		topo_links.append('path').style('fill', 'none').style('stroke', '#ccc').style('stroke-width', 2)

		return topo_links
	},
	createNodes (container, nodes) {
		topo_nodes = container
			.selectAll('g.topology__node')
			.data(nodes)
			.enter()
			.append('g')
			.attr('class', 'topology__node')

		topo_nodes.append('circle').attr('r', 5).attr('fill', '#333')

		return topo_nodes
	},
	bindEvents () {
		const self = this
		topo_nodes.on('mouseenter', function () {
			d3.select(this).style('cursor', 'pointer')
			!self.dragging && topo_tooltip.show(...arguments, this)
		})

		topo_nodes.on('mouseout', function () {
			topo_tooltip.hide(...arguments, this)
		})
	}
})

tp.init()

const updateBtn = document.getElementById('update-btn')

updateBtn.addEventListener('click', event => {
	const data = createTopoDatas(20, 30)
	const circle = new AVSDFCircle(data, [ 1000 / 2, 700 / 2 ])
	circle.layout()
	tp.update(data)
})
