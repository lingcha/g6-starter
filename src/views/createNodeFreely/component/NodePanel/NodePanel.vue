<template>
  <div class="node_panel">
    <div v-for="item in nodeList" :key="item" class="node_li">
      <div :class="['item_shape', item]" draggable="true" @dragend="addNode(item, $event)"></div>
      <div>{{ item }}</div>
    </div>

    <div class="node_li">
      <div :class="['item_shape']" draggable="true" @dragend="addCombo(item, $event)"></div>
      <div>combo</div>
    </div>
    <div>
      <button @click="emit('changeEdge')">切换连边样式</button>
    </div>
    <div>
      <button @click="emit('getData')">获取数据</button>
    </div>

    <div>
      <button @click="emit('loadData')">加载</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['addNode', 'getData', 'changeEdge', 'loadData'])

// 节点列表
const nodeList = [
  'rect',
  'circle',
]

// 添加节点
function addNode(type, e) {
  emit('addNode', {
    type,
    x: e.x,
    y: e.y
  })
}

// 添加combo
function addCombo(type, e) {
  emit('addCombo', {
    type,
    x: e.x,
    y: e.y
  })
}
</script>

<style lang="scss" scoped>
.node_panel {
  position: absolute;
  left: 10px;
  top: 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  padding: 10px 4px;
  border-radius: 4px;
}

.node_li {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }
}

.item_shape {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}

.circle {
  border-radius: 50%;
}
</style>