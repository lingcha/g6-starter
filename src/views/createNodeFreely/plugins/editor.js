import action from "./action";
import fillwall from "@/assets/node/firewall.svg";
import eventFactory from "./eventFactory";
import G6 from "@antv/g6";

class GraphController {
  constructor(graphConfig) {
    this.graph = new G6.Graph(graphConfig);
    this.action = action(this.graph);
    this.graph.set("controller", this);
    this.registerEvent();
    this.lineStyle = "basic";
    this.initData = {};
  }

  init(data) {
    this.graph.get("canvas").set("localRefresh", false);
    this.graph.read(data);
  }

  triggerEvent(type) {
    this.removeEvent();
    this.registerEvent(type);
  }

  registerEvent(type = "edit") {
    this.event = eventFactory(this.graph, type);

    this.event.forEach((item) => {
      this.graph.on(item.eventName, item.handler);
    });
  }

  removeEvent() {
    this.event.forEach((item) => {
      this.graph.off(item.eventName, item.handler);
    });
  }

  // 添加节点
  addNodeByDrag(nodeId, nodeData) {
    const point = this.graph.getPointByClient(nodeData.x, nodeData.y);
    const model = {
      id: nodeId,
      x: point.x,
      y: point.y,
      data: 32,
      error: true,
      inInternet: true,
      //   ...nodeData,
      size: 50,
      label: nodeData.type,
      img: fillwall,
      type: nodeData.type === "circle" ? "circle-badge-desc" : nodeData.type,
    };
    // 在这里可以进行一些数据结构的处理，比如检查节点是否已存在等
    const { addNodeRule } = this.action;
    const canAdd = addNodeRule(this.graph, model);
    if(canAdd){
      this.graph.addItem("node", model, false);
      this.makeNodeFirst();
    } else{
      window.alert('请先放置安全组')
    }
  }

  updateNode(nodeId,model){
    const item = this.graph.findById(nodeId)
    this.graph.updateItem(item,model)
  }

  // 移除节点
  removeNode(nodeId) {
    // 在这里可以进行一些数据结构的处理
    this.graph.removeItem(nodeId);
  }

  // 切换线的样式
  setEdgeStyle(lineStyle) {
    this.lineStyle = lineStyle;
  }

  // 添加 combo
  addCombo(comboId, comboNodes) {
    // 在这里可以进行一些数据结构的处理
    const point = this.graph.getPointByClient(comboNodes.x, comboNodes.y);

    const model = {
      id: comboId,
      type: "rect",
      label: "默认安全组",
      x: point.x,
      y: point.y,
      size: [100, 80],
      style: {
        fill: "#ffffff00",
        lineDash: [4, 4],
      },
      labelCfg: {
        position: "top",
        refY: -20,
      },
    };

    this.graph.createCombo(model, []);
  }

  loadData() {
    this.initData = JSON.parse(localStorage.getItem("data"));
    this.graph.read(this.initData);
  }

  getData() {
    const data = this.graph && this.graph.save();
    const newEdges = data.edges.map((item) => {
      const { id, source, target, type, startPoint, endPoint } = item;
      return {
        id,
        source,
        target,
        type,
        startPoint,
        endPoint,
      };
    });
    const jsonData = JSON.stringify({ ...data, edges: newEdges });
    localStorage.setItem("data", jsonData);
    // ceshi 换边样式
  }

  makeNodeFirst() {
    this.graph.getNodes().forEach((node) => {
      debugger;
      node.toFront();
    });
  }
}

export default GraphController;
