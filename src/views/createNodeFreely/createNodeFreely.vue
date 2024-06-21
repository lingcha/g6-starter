<template>
  <div class="page">
    <NodePanel @addNode="addNode" @addCombo="addCombo" @getData="getData()" @changeEdge="changeEdge" />
    <div id="graph" ref="graphRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import G6 from '@antv/g6';
import NodePanel from './component/NodePanel/NodePanel.vue'
import tooltip from '../../assets/tooltip.jpg';
import vuesvg from '../../assets/vue.svg';

G6.registerNode(
  'circle-anchors-icon',
  {
    afterDraw(cfg, group) {
      const size = cfg.size;
      const w = size[0] - size[0] / 3;
      const h = size[1] - size[1] / 3;

      const isError = cfg.error;
      // image
      group.addShape('image', {
        draggable: true,
        attrs: {
          x: - w / 2,
          y: - h / 2,
          width: w,
          height: h,
          img: cfg.img
        }
      })

      if (isError) {

        const rootShape = group.getFirst();
        rootShape.attr('fill', '#f9d4d5')
        rootShape.attr('stroke', '#f60000')
        group.addShape('image', {
          draggable: true,
          attrs: {
            x: cfg.size[0] * 3 / 4 / 2,
            y: -Math.sqrt(Math.pow(cfg.size[0] / 2, 2) + Math.pow(cfg.size[0] * 3 / 4 / 2, 2)) / 2,
            width: 10,
            height: 10,
            img: vuesvg
          }
        })
      }

      // text
      if (cfg.label) {
        group.addShape('text', {
          attrs: {
            x: 0, // 居中
            y: size[1] / 2,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.label,
            fill: isError ? 'red' : '#666',
          }
        })
      }
    }
  },
  // 继承内置节点类型的名字，例如基类 'single-node'，或 'circle', 'rect' 等
  // 当不指定该参数则代表不继承任何内置节点类型
  'circle',
);


const arrowBoth = ref(true)

const graphRef = ref(null)

const graph = ref(null)

const graphData = {
  // 点集
  nodes: [
    {
      id: 'node1',
      size: [100, 100],
      img: tooltip,
      label: '测试',
      error: true,
      style: {
        fill: '#fff'
      }
    },
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    // {
    //   source: 'node1',
    //   target: 'node2',
    // },
  ],
}



function initGraph() {


  graph.value = new G6.Graph({
    container: graphRef.value,
    width: graphRef.value.clientWidth,
    height: graphRef.value.clientHeight,
    linkCenter: true,
    groupByTypes: false,
    modes: {
      default: ['create-edge',
        'drag-canvas',
        'zoom-canvas',
        'drag-node',
        'drag-combo'
      ]
    },
    // defaultEdge: {
    //   type: 'quadratic',
    //   style: {
    //     stroke: '#F6BD16',
    //     lineWidth: 2,
    //   },
    // },
    defaultNode: {
      type: 'circle-anchors-icon',
    },
    defaultCombo: {
      labelCfg: {
        position: 'top',
        offset: [20, 20, 20, 20]
      }
    }
  })


  graph.value.on('node:dragend', (e) => {
    if (e.item.getModel().comboId) {
      graph.value.updateCombo(e.item.getModel().comboId)
    }
  })


  graph.value.edge((edge) => {
    return {
      id: edge.id,
      type: 'quadratic',
      style: {
        stroke: '#F6BD16',
        lineWidth: 2,
      },
    };
  })


  graph.value.on('aftercreateedge', (e) => {


    if (arrowBoth.value) {
      graph.value.updateItem(e.edge, {
        type: 'arrow-both',
        style: {
          startArrow: {
            path: G6.Arrow.triangle(5, 5, 50), // 重新设置起始箭头的路径和尺寸
            d: 50, // 重新定义起始箭头距离起点的距离
          },
          endArrow: {
            path: G6.Arrow.triangle(5, 5, 50), // 重新设置结束箭头的路径和尺寸
            d: 50, // 重新定义结束箭头距离终点的距离
          },
          // endArrow: true,
          // startArrow: true
        }
      })
    }

    const edges = graph.value.save().edges;
    G6.Util.processParallelEdges(edges);
    graph.value.getEdges().forEach((edge, i) => {
      graph.value.updateItem(edge, {
        curveOffset: edges[i].curveOffset,
        curvePosition: edges[i].curvePosition,
      });
    });
  })

  graph.value.on('node:click', (e) => {
    // console.log(e)
    e.item.toFront()
  })
  graph.value.get('canvas').set('localRefresh', false)
  graph.value.data(graphData)
  graph.value.render()

}

function changeEdge() {
  arrowBoth.value = !arrowBoth.value

}

function getData() {
  console.log(graph.value && graph.value.save())
  // ceshi 换边样式

}

function isInCombo(node, bbox) {
  if (node.x >= bbox.x && node.x <= (bbox.x + bbox.width)) {
    if (node.y >= bbox.y && node.y <= (bbox.y + bbox.height)) {
      return true
    }
    return false
  }
  return false
}

// 添加节点
function addNode(data) {
  const point = graph.value.getPointByClient(data.x, data.y)

  const model = {
    id: 'node' + Math.random(),
    label: data.type,
    type: data.type === 'circle' ? 'circle-anchors-icon' : data.type, // 图片类型的节点
    size: [100, 100],
    img: tooltip,
    x: point.x,
    y: point.y,
  }

  const t = graph.value.getCombos().find(item => {
    return isInCombo(model, item.getBBox())
  })

  if (t) {
    model.comboId = t._cfg.id
  }


  // 向画布添加节点
  graph.value.addItem('node', model, false)
}

// 添加combo
function addCombo(data) {
  const point = graph.value.getPointByClient(data.x, data.y)

  const model = {
    id: 'combo1',
    type: 'rect',
    label: '默认安全组',
    x: point.x,
    y: point.y,
    size: [100, 80],
    style: {
      fill: '#ffffff',
      lineDash: [4, 4]
    },
    labelCfg: {
      position: 'top',
      refY: -20
    }
  }

  graph.value.createCombo(model, [])
}




onMounted(() => {
  initGraph()
})


</script>

<style lang="scss" scoped>
.page {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#graph {
  width: 100%;
  height: 100%;
}
</style>