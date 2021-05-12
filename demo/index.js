import { D3Topology } from '../src'
import obj from './test_1.json'

const data = {
  nodes: [
    {
      id: 'node1',
      type: '',
      x: 100,
      y: 150,
      config: {
        name: 'node1-abc'
      }
    },
    {
      id: 'node2',
      type: '',
      x: 200,
      y: 100,
      config: {
        name: 'node2'
      }
    },
    {
      id: 'node3',
      type: '',
      x: 300,
      y: 300,
      config: {
        name: 'node3'
      }
    },
    {
      id: 'node4',
      type: '',
      x: 200,
      y: 400,
      config: {
        name: 'node4'
      }
    },
    {
      id: 'node5',
      type: '',
      x: 200,
      y: 200,
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
  nodeConfig: {
    showLabel: true,
    labelText: d => d.name
  }
})

tp.init()