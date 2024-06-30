import G6, {
  Graph
} from "@antv/g6";

let clickedNode = null;

function eventFactory(graphInstance, type) {
  if (type === "edit") {
    return [{
        eventName: "combo:dragend",
        handler: (e) => {
          // graphInstance.get("controller").makeNodeFirst();
        }
      },
      {
        eventName: "canvas:click",
        handler: (e) => {
          if (clickedNode) {
            graphInstance.setItemState(clickedNode, "click", false);
            clickedNode = null;
          }
        },
      },
      {
        eventName: "node:click",
        handler: (e) => {
          if (!clickedNode) {
            graphInstance.setItemState(e.item, "click", true);
            clickedNode = e.item;
          } else {
            clickedNode = null;
          }
        },
      },
      {
        eventName: "node:dragend",
        handler: (e) => {
          const model = e.item.getModel();

          if (model.comboId) {
            // graphInstance.get("controller").makeNodeFirst();
            graphInstance.updateCombo(e.item.getModel().comboId);
          }

        },
      },
      {
        eventName: "aftercreateedge",
        handler: () => {
          if (clickedNode)
            graphInstance.setItemState(clickedNode, "click", false);
        },
      },
      {
        eventName: "aftercreateedge",
        handler: (e) => {
          const editor = graphInstance.get("controller");
          console.log(e)
          // editor.makeNodeFirst(graphInstance);
          // const {
          //   triggerLineStyle
          // } = editor.action;
          // const config = triggerLineStyle(editor.lineStyle, e)
          // graphInstance.updateItem(
          //   e.edge,
          //   config
          // );
          // const edges = graphInstance.save().edges;

          // G6.Util.processParallelEdges(edges);
          // graphInstance.getEdges().forEach((edge, i) => {
          //   // edge.toBack();
          //   graphInstance.updateItem(edge, {
          //     curveOffset: edges[i].curveOffset,
          //     curvePosition: edges[i].curvePosition,
          //   });
          // });
        },
      },
      {
        eventName: "aftercreateedge",
        handler: (e) => {
          if (e.edge.getSource() === e.edge.getTarget())
            window.setTimeout(() => {
              graphInstance.removeItem(e.edge)
            }, 0)
        },
      },
      {
        eventName: "beforerender",
        handler: () => {
          const editor = graphInstance.get("controller");

          if ("edges" in editor.initData) {
            const {
              edges
            } = editor.initData;
            G6.Util.processParallelEdges(edges);
            graphInstance.getEdges().forEach((edge, i) => {
              graphInstance.updateItem(edge, {
                curveOffset: edges[i].curveOffset,
                curvePosition: edges[i].curvePosition,
              });
            });
          }
        },
      },
      {
        eventName: "afterrender",
        handler: () => {
          const editor = graphInstance.get("controller");

          // editor.makeNodeFirst();
        },
      },
    ];
  }
}

export default eventFactory;