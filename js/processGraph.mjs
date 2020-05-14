import {
  tranNullObject
} from "./myUtil.mjs"

const ProgressStateEnum = {
  DONE: 10,
  DOING: 20,
  WILL_DO: 30,
  "10": "已执行",
  "20": "当前执行",
  "30": "未执行"
};

const TaskTypeEnum = {
  "0": "串行任务",
  "2": "并行任务"
}

//提供的节点的基本数据结构
const processDataTpl = {
  "taskType": 0, // TaskTypeEnum,
  "state": 0, //ProgressStateEnum
  "subTasks": [], //子级节点, 如果没有为null
}

const optionsDefault = {
  nodeBox: {
    minWidth: 140, //总长度 最小宽度
    minHeight: 50, //总长度 最小高度 暂时不支持高度动态改变
    maxWidth: 200, //总高度 最大宽度
    maxHeight: 50, //总高度 最大高度, 暂时不支持高度动态改变

    //留出一定的空间来画边框和连接上下节点
    paddingLeft: 15,
    paddingTop: 4,

    textMarginLeft: 10, //文字离左边框的偏移
    textLine1MarginTop: -9, //第一行文字偏离中心的高度
    textLine2MarginTop: 9, //第二行文字偏离中心的高度

    //第一行显示的文字
    textLine1: function (processNode) {
      return ""
    },
    //第二行显示的文字
    textLine2: function (processNode) {
      return ""
    },
  },
}

export default function processGraph(options) {
  tranNullObject(options, optionsDefault);

  // UTF8字符集实际长度计算
  function getUTF8StrLen(str) {
    if (!str) {
      return 0;
    }
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) {
        realLength += 1;
      } else {
        // 如果是中文则长度加3
        realLength += 3;
      }
    }
    return realLength;
  }

  //得到节点状态
  function getNodeState(processNode, lastState) {
    lastState = lastState || processNode.state || ProgressStateEnum.DONE;
    if (processNode.state > lastState) {
      lastState = processNode.state;
    }
    if (processNode.subTasks) {
      for (let item of processNode.subTasks) {
        let childNodeState = getNodeState(item, lastState);
        if (childNodeState > lastState) {
          lastState = childNodeState;
        }
      }
    }
    return lastState;
  }

  //由流程数据得到渲染节点数据
  function createNodeTree(progress) {
    if (Array.isArray(progress.subTasks) && progress.subTasks.length == 0) {
      progress.subTasks = null;
    }
    if (!progress.subTasks) {
      let nodeBox = {
        type: progress.taskType,
        start: {
          x: 0,
          y: 0,
        },
        box: {
          textLine1: options.nodeBox.textLine1(progress),
          textLine2: options.nodeBox.textLine2(progress),
          cx: 0,
          cy: 0,
        },
        end: {
          x: 0,
          y: 0,
        },
        width: 0,
        height: options.nodeBox.minHeight,
        state: getNodeState(progress)
      }
      nodeBox.width = Math.max(options.nodeBox.minWidth, getUTF8StrLen(nodeBox.box.textLine1) * 6.5 + options.nodeBox.paddingLeft * 3, getUTF8StrLen(nodeBox.box.textLine2) *
        6.5 + options.nodeBox.paddingLeft * 3);
      if (nodeBox.width > options.nodeBox.maxWidth) {
        nodeBox.width = options.nodeBox.maxWidth;
      }

      return nodeBox
    }

    if (Array.isArray(progress.subTasks)) {
      let node = {
        type: progress.taskType,
        start: {
          x: 0,
          y: 0,
        },
        body: [],
        end: {
          x: 0,
          y: 0,
        },
        width: 0,
        height: 0,
        maxWidth: 0, //子级最大宽度
        maxHeight: 0, //子级最大高度
        state: getNodeState(progress)
      }

      let maxWidth = 0;
      let maxHeight = 0;

      for (let item of progress.subTasks) {
        let child = createNodeTree(item);
        node.body.push(child);
        if (progress.taskType == 0) {
          node.width += child.width;
        }
        if (progress.taskType == 2) {
          node.height += child.height;
        }
        if (maxWidth < child.width) {
          maxWidth = child.width;
        }
        if (maxHeight < child.height) {
          maxHeight = child.height;
        }
      }

      node.maxWidth = maxWidth;
      node.maxHeight = maxHeight;

      if (progress.taskType == 0) {
        node.height += maxHeight;
      }
      if (progress.taskType == 2) {
        node.width += maxWidth;
      }

      return node
    }
  }

  //偏移节点
  function translateNode(node, x, y) {
    node.start.x += x;
    node.start.y += y;
    node.end.x += x;
    node.end.y += y;
    if (node.box) {
      node.box.cx += x;
      node.box.cy += y;
    }
  }

  //计算节点关键点位置
  function calNodeKeyPoint(node, x = 0, y = 0) {
    if (node.box) {
      let cx = node.width / 2;
      let cy = node.height / 2;
      node.box.cx = cx;
      node.box.cy = cy;
      node.start.y = cy;
      node.end.x = node.width;
      node.end.y = cy;

      translateNode(node, x, y);
    }

    if (Array.isArray(node.body)) {
      let cx = node.width / 2;
      let cy = node.height / 2;
      node.start.x = node.body[0].start.x;
      node.start.y = cy;
      node.end.x = node.width;
      node.end.y = cy;
      translateNode(node, x, y);
      cx += x;
      cy += y;

      let sx = node.start.x,
        sy = node.start.y - cy;
      let item = null;
      for (let i = 0; i < node.body.length; i++) {
        item = node.body[i];

        if (node.type == 0) {
          sy = cy - item.height / 2;
        }

        calNodeKeyPoint(item, sx, sy);
        if (node.type == 2) {
          sy = sy + item.height;
        }
        if (node.type == 0) {
          sx = sx + item.width;
        }
      }

    }
  }

  //得到渲染流程图svg图形数据
  function renderProcessMap(node, map) {
    map = map || {
      lines: [],
      boxes: []
    }

    if (Array.isArray(node.body)) {

      if (node.type == 0) {
        let lastNode = null;
        for (let child of node.body) {
          if (lastNode) {
            map.lines.push({
              x1: lastNode.end.x,
              y1: lastNode.end.y,
              x2: child.start.x,
              y2: child.start.y,
              state: node.state
            });
          } else {
            map.lines.push({
              x1: node.start.x,
              y1: node.start.y,
              x2: child.start.x,
              y2: child.start.y,
              state: node.state
            });
          }
          lastNode = child;
          renderProcessMap(child, map);
        }
        map.lines.push({
          x1: lastNode.end.x,
          y1: lastNode.end.y,
          x2: node.end.x,
          y2: node.end.y,
          state: node.state
        });
      }
      if (node.type == 2) {
        for (let child of node.body) {
          map.lines.push({
            x1: node.start.x,
            y1: node.start.y,
            x2: child.start.x,
            y2: child.start.y,
            state: node.state
          });
          renderProcessMap(child, map);

          if (child.end.y != node.end.y) {
            map.lines.push({
              x1: child.end.x,
              y1: child.end.y,
              x2: node.end.x,
              y2: child.end.y,
              state: node.state
            });
            map.lines.push({
              x1: node.end.x,
              y1: child.end.y,
              x2: node.end.x,
              y2: node.end.y,
              state: node.state
            });
          } else {
            map.lines.push({
              x1: child.end.x,
              y1: child.end.y,
              x2: node.end.x,
              y2: node.end.y,
              state: node.state
            });
          }
        }
      }
    }
    if (node.box) {
      let width = node.width - options.nodeBox.paddingLeft * 2;
      let height = options.nodeBox.minHeight - options.nodeBox.paddingTop * 2;
      let x = node.box.cx - width / 2;
      let y = node.box.cy - height / 2;
      let boxMap = {
        rect: {
          x,
          y,
          width,
          height
        },
        textLine1: {
          x: node.box.cx - width / 2 + options.nodeBox.textMarginLeft,
          y: node.box.cy + options.nodeBox.textLine1MarginTop,
          text: node.box.textLine1,
        },
        textLine2: {
          x: node.box.cx - width / 2 + options.nodeBox.textMarginLeft,
          y: node.box.cy + options.nodeBox.textLine2MarginTop,
          text: node.box.textLine2,
        },
        lines: [],
        state: node.state
      };
      map.boxes.push(boxMap);
      let lineLength = (node.width - width) / 2;

      boxMap.lines.push({
        x1: node.start.x,
        y1: node.start.y,
        x2: node.start.x + lineLength,
        y2: node.start.y,
        state: node.state
      });
      boxMap.lines.push({
        x1: node.end.x - lineLength,
        y1: node.end.y,
        x2: node.end.x,
        y2: node.end.y,
        state: node.state
      });
      //箭头
      boxMap.lines.push({
        x1: node.start.x + lineLength,
        y1: node.start.y,
        x2: node.start.x + lineLength - 5,
        y2: node.start.y - 3,
        state: node.state
      });
      boxMap.lines.push({
        x1: node.start.x + lineLength,
        y1: node.start.y,
        x2: node.start.x + lineLength - 5,
        y2: node.start.y + 3,
        state: node.state
      });
    }

    return map;
  }

  //流程最顶成转换成串行审批
  function tranProcessListData(progressList) {
    if (Array.isArray(progressList)) {
      return {
        "taskType": 0,
        "taskName": null,
        "subTasks": progressList,
        "state": 10,
        "assignees": [],
      }
    }
    return progressList;
  }

  //得到图形的svg描述数据
  function getProcessSVGMap(progressData, x = 0, y = 0) {
    progressData = tranProcessListData(progressData);
    let nodeTree = createNodeTree(progressData);
    calNodeKeyPoint(nodeTree, x, y);
    let processMap = renderProcessMap(nodeTree);
    return {
      nodeTree,
      processMap
    }
  }

  return getProcessSVGMap
}
