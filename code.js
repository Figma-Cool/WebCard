figma.showUI(__html__);
figma.ui.resize(400, 520);

const link = "https://logo.clearbit.com/baidu.com";
const selected = figma.currentPage.selection[0];

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

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

//创建 ico img
function createIco(fills, xx, yy) {
  const icoImg = figma.createFrame();
  //   figma.currentPage.appenChild(icoImg);
  icoImg.x = xx;
  icoImg.y = yy;
  icoImg.name = "ico";
  icoImg.fills = fills;
  icoImg.resize(24, 24);
  console.log(icoImg);
  icoImg.cornerRadius = 6;
  return icoImg
}

function createFrame(item, x, y) {
  const frame = figma.createFrame();
  frame.name = item;
  frame.fills = [];
  frame.resize(400, 180);
  //   item.parent.appendChild(frame);
  frame.x = x;
  frame.y = y;
  //   frame.appendChild(item);
  frame.layoutMode = "VERTICAL";
  frame.layoutAlign = "STRETCH";
  frame.itemSpacing = 20;
  frame.paddingTop = 20;
  frame.paddingBottom = 20;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  return frame
}

//创建 title
async function createTitle(meta, x, y) {
  await figma.loadFontAsync({ family: "Noto Sans SC", style: "Bold" });
  const textNode = figma.createText();
  console.log(meta);
  textNode.x = x;
  textNode.y = y;
  textNode.fontName = { family: "Noto Sans SC", style: "Bold" };
  textNode.fontSize = 24;
  textNode.characters = `${meta.title} | ${meta.site}`;
  textNode.name = "title";
  textNode.fills = [0, 0, 0];
  return textNode;
}

//创建 des
async function createDes(meta, x, y) {
  await figma.loadFontAsync({ family: "Noto Sans SC", style: "Regular" });
  const textNode = figma.createText();
  console.log(meta);
  textNode.x = x;
  textNode.y = y;
  textNode.fontName = { family: "Noto Sans SC", style: "Regular" };
  textNode.fontSize = 14;
  textNode.opacity = 0.6;
  textNode.characters = meta.description;
  textNode.name = "description";
  textNode.fills = [0, 0, 0];
  return textNode;
}

function GenerateCard(icoFills, returnData) {
  createIco(icoFills, returnData.x, returnData.y);
  createTitle(returnData.iframe.meta, returnData.x, returnData.y);
  createDes(returnData.iframe.meta, returnData.x, returnData.y);
  createFrame(
    `${returnData.iframe.meta.title} | ${returnData.iframe.meta.site}`,
    returnData.x,
    returnData.y
  );
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "returnData":
      const nodes = figma.currentPage.selection;
      if (nodes.length > 0) {
        nodes.forEach((node) => {
          console.log(msg);
          let imageIco = figma.createImage(msg.returnData.icoImg);
          if (node.type !== "SLICE" && node.type !== "GROUP") {
            let icoFills = clone(node.fills);
            icoFills.push({
              type: "IMAGE",
              scaleMode: "FILL",
              imageHash: imageIco.hash,
            });
            icoFills.shift();
            GenerateCard(icoFills, msg.returnData);
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
