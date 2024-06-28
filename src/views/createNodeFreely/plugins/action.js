import G6 from '@antv/g6';

function action() {
  function isInCombo(node, bbox) {
    if (node.x >= bbox.x && node.x <= bbox.x + bbox.width) {
      if (node.y >= bbox.y && node.y <= bbox.y + bbox.height) {
        return true;
      }
      return false;
    }
    return false;
  }

  function triggerLineStyle(lineStyle, e) {
    function calculateTriangleD(e) {
      const size = e.edge.getTarget()._cfg.bboxCache.width;
      const { lineWidth } = e.edge.getTarget()._cfg.keyShape.getDefaultAttrs();
      return size / 2 + lineWidth * 2;
    }

    if (lineStyle === "basic") {
      return {
        style: {
          lineWidth: 1,
          lineDash: [3],
          stroke: "#c5e4fe",
        },
      };
    }
    if (lineStyle === "arrow-both") {
      return {
        style:{
          startArrow: {
            lineDash: [0],
            fill: "#c5e4fe",
            path: G6.Arrow.triangle(5, 5, calculateTriangleD(e)), // 重新设置起始箭头的路径和尺寸
            d: calculateTriangleD(e), // 重新定义起始箭头距离起点的距离
          },
          endArrow: {
            lineDash: [0],
            fill: "#c5e4fe",
            path: G6.Arrow.triangle(5, 5, calculateTriangleD(e)), // 重新设置结束箭头的路径和尺寸
            d: calculateTriangleD(e), // 重新定义结束箭头距离终点的距离
          },
        }
      };
    }
  }

  function addNodeRule(graphInstance,model) {
    const t = graphInstance.getCombos().find((item) => {
      return isInCombo(model, item.getBBox());
    });

    if (t) {
      model.comboId = t._cfg.id;
      return true;
    } else {
      return false;
    }
  }

  return { addNodeRule, triggerLineStyle };
}

export default action;
