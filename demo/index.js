import { D3Topology } from '../src'

const data = {
  nodes: [
    {
      id: 'node1',
      type: '',
      config: {
        name: 'node1-abc'
      }
    },
    {
      id: 'node2',
      type: '',
      config: {
        name: 'node2'
      }
    },
    {
      id: 'node3',
      type: '',
      config: {
        name: 'node3'
      }
    },
    {
      id: 'node4',
      type: '',
      config: {
        name: 'node4'
      }
    },
    {
      id: 'node5',
      type: '',
      config: {
        name: 'node5'
      }
    }
  ],
  links: [
    {
      source: 'node1',
      target: 'node2'
    },
    {
      source: 'node2',
      target: 'node3'
    },
    {
      source: 'node1',
      target: 'node4'
    },
    {
      source: 'node5',
      target: 'node4'
    }
  ]
}

const tp = new D3Topology({
  data,
  container: '#topo-container',
  dragable: true,
  animate: true,
  distance: 200,
  nodeConfig: {
    showLabel: true,
    labelText: d => d.config.name
  },
  lineConfig: {
    type: 'curve'
  }
})

tp.init()