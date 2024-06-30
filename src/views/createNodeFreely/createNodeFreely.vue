<template>
  <div class="page">
    <NodePanel @addNode="addNode" @addCombo="addCombo" @getData="graphController?.getData()"
      @loadData="graphController?.loadData()" @changeEdge="triggerEdgeStyle" />
    <div id="graph" ref="graphRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import './component/registerDArrow';
import './component/registerSafeDev';
import './component/registerAssets';
import NodePanel from './component/NodePanel/NodePanel.vue'
import fillwall from '../../assets/node/firewall.svg';
import GraphController from './plugins/editor';


const arrowBoth = ref(true)

const graphRef = ref(null)

const graphController = shallowRef(null)

const graphData = {
  // 点集
  nodes: [
  ],
  // 边集
  edges: [
  ],
}

const triggerEdgeStyle = () => {
  if (graphController.value) {
    if (arrowBoth.value) {
      // 修改editor的线的状态，控制g6的行为
      graphController.value.setEdgeStyle('basic')

    }
    else {
      graphController.value.setEdgeStyle('arrow-both')
    }
  }

  arrowBoth.value = !arrowBoth.value
}


function initGraph() {
  // 实例化editor
  graphController.value = new GraphController({
    container: graphRef.value,
    width: graphRef.value.clientWidth,
    height: graphRef.value.clientHeight,
    linkCenter: true,
    groupByTypes: false,
    renderer: 'canvas',
    modes: {
      default: [{
        type: 'create-edge',
        edgeConfig: {
          // type: 'arrow-both'
        },
        shouldBegin(e) {
          return e.item.getDefaultCfg().type !== 'combo'
        },
        shouldEnd(e, self) {

          return e.item.getDefaultCfg().type !== 'combo'
        }
      },
      {
        type: 'drag-node', onlyChangeComboSize: false, shouldEnd(e, targetItem) {
          if (targetItem) {
            if (targetItem.getDefaultCfg().type === 'combo') {
              return true
            }
          }
        }
      },
      {
        type: 'drag-combo', shouldEnd(e, newParent) {
          if (newParent) {
            return false
          }
          return true
        }
      },
        'drag-canvas',
        'zoom-canvas',
      ]
    },
    defaultNode: {
      type: 'circle-anchors-icon',
    },
    defaultEdge: {
      type: 'double-arrow',
      style: {
        lineWidth: 1,
        lineDash: [3],
        stroke: '#c5e4fe'
      }
    },
    defaultCombo: {
      labelCfg: {
        position: 'top',
        offset: [20, 20, 20, 20]
      }
    },

  })

  // 初始化数据并渲染
  graphController.value.init(graphData)

}

// 添加节点
function addNode(data) {
  graphController.value.addNodeByDrag('node' + Math.random(), data)
}

// 添加combo
function addCombo(data) {
  graphController.value.addCombo('comboId' + Math.random(), data)
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