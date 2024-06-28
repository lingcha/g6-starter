import G6 from "@antv/g6";

function setClickedShape(rootShape) {
  rootShape.attr("stroke", "#c8966d");
}

// 正常情况下的圆圈的shape的设置
function setNormalShape(rootShape) {
  rootShape.attr("stroke", "#88b0ff");
}

G6.registerNode(
  "circle-anchors-icon",
  {
    afterDraw(cfg, group) {
      const textShape = group?.find((el) => {
        return el.cfg.type === "text";
      });

      const rootShape = group.getFirst();
      if (textShape) {
        group?.removeChild(textShape, true);
      }
      if (cfg && group) {
        const size = typeof cfg.size === "number" ? cfg.size : 50;
        const w = size - size / 3;
        const h = size - size / 3;

        // image

        group.addShape("image", {
          draggable: true,
          attrs: {
            x: -w / 2,
            y: -h / 2,
            width: w,
            height: h,
            img: cfg.img,
          },
        });
      }

      return rootShape;
    },
    setState(name, value, node) {
      const group = node.getContainer(); // 获取节点的 Group
      const rootShape = group.getFirst();

      if (name === "click") {
        if (value) {
          setClickedShape(rootShape);
        } else {
          setNormalShape(rootShape);
        }
      }
    },
  }, 
  // 继承内置节点类型的名字，例如基类 'single-node'，或 'circle', 'rect' 等
  // 当不指定该参数则代表不继承任何内置节点类型
  "circle"
);
