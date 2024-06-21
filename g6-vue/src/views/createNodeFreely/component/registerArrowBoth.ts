import G6 from "@antv/g6";

G6.registerEdge('arrow-both', {
    getShapeStyle(cfg) {
        return {
            stroke: '#F6BD16',
            lineWidth: 2,
            startArrow: {
                path: G6.Arrow.triangle(5, 5, 50), // 重新设置起始箭头的路径和尺寸
                d: 50, // 重新定义起始箭头距离起点的距离
            },
            endArrow: {
                path: G6.Arrow.triangle(5, 5, 50), // 重新设置结束箭头的路径和尺寸
                d: 50, // 重新定义结束箭头距离终点的距离
            },
        }
    }
}, 'quadratic')

export default G6;