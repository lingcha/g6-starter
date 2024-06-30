import G6 from "@antv/g6";


function calculateTriangleD(e) {
    const size = e.getTarget()._cfg.bboxCache.width;
    const {
        lineWidth
    } = e.getTarget()._cfg.keyShape.getDefaultAttrs();
    return size / 2 + lineWidth * 2;
}

function setNormalShape(rootShape, t) {
    rootShape.attr({
        startArrow: {
            lineDash: [0],
            fill: "#c5e4fe",
            path: G6.Arrow.triangle(5, 5, calculateTriangleD(t)), // 重新设置起始箭头的路径和尺寸
            d: calculateTriangleD(t), // 重新定义起始箭头距离起点的距离
        },
        endArrow: {
            lineDash: [0],
            fill: "#c5e4fe",
            path: G6.Arrow.triangle(5, 5, calculateTriangleD(t)), // 重新设置结束箭头的路径和尺寸
            d: calculateTriangleD(t), // 重新定义结束箭头距离终点的距离
        },
    })
}

G6.registerEdge('double-arrow', {
    afterDraw(cfg, group) {
        const root = group.getFirst()
        console.log(root)
    },
    afterUpdate(cfg, node) {
        const group = node.getContainer();
        const root = group.getFirst()
        if (group.cfg.item.getTarget()._cfg) {
            const edge = group.cfg.item
            setNormalShape(root, edge)
        }
    }
}, 'quadratic')