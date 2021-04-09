figma.showUI(__html__);
figma.ui.resize(400, 520);

const link = "https://logo.clearbit.com/baidu.com";
const selected = figma.currentPage.selection[0];

// 分割域名
function linkStringHandle(s) {
  let string = s;
  return string.replace("https://", "").replace("http://", "").split("/")[0];
}

//选择所有，post new selection
function selection() {
  let selection = [];

  for (let t of figma.currentPage.selection) {
    selection.push({
      id: t.id,
      characters: t.characters,
      link: linkStringHandle(t.characters),
      x: t.x,
      y: t.y,
    });
  }

  figma.ui.postMessage({
    selection: selection,
  });
}

selection();

function createIco(fills, xx, yy) {
  const icoImg = figma.createFrame();
  //   figma.currentPage.appenChild(icoImg);
  icoImg.x = xx;
  icoImg.y = yy;
  icoImg.name = "ico";
  icoImg.fills = fills;
  icoImg.resize(64, 64);
  console.log(icoImg);
  icoImg.cornerRadius = 12;
}

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "returnData":
      const nodes = figma.currentPage.selection;
      if (nodes.length > 0) {
        nodes.forEach((node) => {
          console.log(msg);
          let image = figma.createImage(msg.returnData.icoImg);
          if (node.type !== "SLICE" && node.type !== "GROUP") {
            let fills = clone(node.fills);
            fills.push({
              type: "IMAGE",
              scaleMode: "FILL",
              imageHash: image.hash,
            });
            fills.shift();
            createIco(fills, msg.returnData.x, msg.returnData.y);
          }
        });
      } else {
        figma.notify("Please select a layer");
      }
      break;

    case "error":
      // console.log(msg.e);
      // figma.notify(msg.e);
      break;
    case "cancel":
      figma.closePlugin();
      break;
    default:
      break;
  }
};
