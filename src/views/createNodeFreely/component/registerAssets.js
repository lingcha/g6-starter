import G6 from "@antv/g6";
import errorsvg from "@/assets/node/error.svg";
import host from "@/assets/node/host.svg";
import internet from "@/assets/node/internet.svg";
import internetError from "@/assets/node/internetError.svg";

const ratio = 0.56;

// 节点底部的文本
function bottomText(textShape, radius) {
  textShape.attr({
    y: radius + 3,
    textBaseline: "top",
  });
}
// 点击后的shape
function setClickedShape(rootShape) {
  rootShape.attr("stroke", "#c8966d");
}

// 正常情况下的圆圈的shape的设置
function setNormalShape(rootShape) {
  rootShape.attr("fill", "#ffffff");
}

// error情况下的圆圈的shape的设置
function setErrorShape(rootShape) {
  rootShape.attr("fill", "#f9d4d5");
  rootShape.attr("stroke", "#f60000"); // 覆盖了以下的image类型
}
// 计算图形顶部跟底部到圆心的距离
function calculateD2Point(radius, ratio) {
  const w = Math.fround(radius * ratio);

  const chord2Point = Math.floor(Math.cos(w / radius) * radius);

  return { top: chord2Point, bottom: 2 * w - chord2Point };
}

G6.registerNode(
  "circle-badge-desc",
  {
    afterDraw(cfg, group) {
      console.log('afterDraw')
      const size = typeof cfg.size === "number" ? cfg.size : 50;
      const rootShape = group.getFirst();

      const textShape = group?.find((el) => {
        return el.cfg.type === "text";
      });
      if (textShape) {
        bottomText(textShape, size / 2);
      }

      const isError = cfg.error;
      if (isError) {
        setErrorShape(rootShape);
      } else {
        setNormalShape(rootShape);
      }

      if (cfg && group) {
        const w = Math.fround(size * ratio);
        const h = w;
        const { top } = calculateD2Point(size / 2, ratio);

        // image

        group.addShape("image", {
          draggable: true,
          attrs: {
            x: -w / 2,
            y: -top,
            width: w,
            height: h,
            img: host,
          },
        });

        if (isError) {
          const offsetX = size / 4;
          group.addShape("image", {
            draggable: true,
            attrs: {
              x: offsetX,
              y: -Math.sqrt(Math.pow(size / 2, 2) - Math.pow(offsetX, 2)),
              width: 10,
              height: 10,
              img: errorsvg,
            },
            zIndex: 100,
            name: "error-shape",
          });
        }

        if (cfg.inInternet) {
          const offsetX = size / 4;
          group.addShape("image", {
            draggable: true,
            attrs: {
              x: -offsetX - 10,
              y: -Math.sqrt(Math.pow(size / 2, 2) - Math.pow(offsetX, 2)),
              width: 10,
              height: 10,
              img: isError ? internetError : internet,
            },
            zIndex: 100,
            name: "internet-shape",
          });
        }
      }

      if (cfg.data) {
        const { bottom } = calculateD2Point(size / 2, ratio);
        const r = size / 2;
        const middleY = (r - bottom) / 2 + bottom;
        group.addShape("text", {
          attrs: {
            x: 0, // 居中
            y: middleY,
            fontSize: 10,
            textAlign: "center",
            textBaseline: "middle",
            text: cfg.data,
            fill: isError ? "red" : "#666",
          },
        });
      }
      return rootShape;
    },
    update(){
      console.log('update')
    },
    setState(name, value, node) {
      const group = node.getContainer(); // 获取节点的 Group
      const rootShape = group.getFirst();

      if (name === "click") {
        if (value) {
          setClickedShape(rootShape)
        } else {
          const { error = false } = node.getModel();

          if (error) {
            setErrorShape(rootShape);
          } else {
            setNormalShape(rootShape);
          }
        }
      }
    },
  },
  // 继承内置节点类型的名字，例如基类 'single-node'，或 'circle', 'rect' 等
  // 当不指定该参数则代表不继承任何内置节点类型
  "circle"
);
