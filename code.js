figma.showUI(__html__);
figma.ui.resize(0, 0);

const link = "https://logo.clearbit.com/baidu.com";
const selected = figma.currentPage.selection[0];

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

// 分割域名
function linkStringHandle(s = "") {
  const urlMatch = s.match(/(http[s]?:\/\/)?([^\/^\?]+)/);
  return urlMatch ? urlMatch[2] : "";
}

//选择所有，post new selection
function selection() {
  let selection = figma.currentPage.selection.map((t) => ({
    id: t.id,
    characters: t.characters,
    link: linkStringHandle(t.characters),
    x: t.x,
    y: t.y,
  }));

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
  console.log(icoImg, "imgico");
  icoImg.cornerRadius = 6;
  return icoImg;
}

async function GenerateCard(icoFills, returnData) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  const ico = createIco(icoFills, returnData.x, returnData.y);

  //createTitle
  const titleNode = figma.createText();
  titleNode.x = returnData.x;
  titleNode.y = returnData.y;
  titleNode.fontName = { family: "Inter", style: "Bold" };
  titleNode.fontSize = 24;
  titleNode.characters = `${returnData.iframe.meta.title}`;
  titleNode.name = "title";
  titleNode.layoutAlign = "STRETCH";

  //createDes
  const desNode = figma.createText();
  desNode.x = returnData.x;
  desNode.y = returnData.y;
  desNode.fontName = { family: "Inter", style: "Regular" };
  desNode.fontSize = 14;
  desNode.opacity = 0.6;
  if (returnData.iframe.meta.description) {
    desNode.characters =
      returnData.iframe.meta.description.slice(0, 100) + "...";
  }
  desNode.name = "description";
  desNode.layoutAlign = "STRETCH";

  //createInnerFrame
  const innerFrame = figma.createFrame();
  innerFrame.name = "link";
  let innerFrameFills = clone(innerFrame.fills);
  innerFrameFills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  innerFrame.fills = innerFrameFills;
  innerFrame.resize(400, 24);
  innerFrame.layoutMode = "HORIZONTAL";
  innerFrame.layoutAlign = "INHERIT";
  innerFrame.counterAxisAlignItems = "CENTER";
  innerFrame.itemSpacing = 8;
  innerFrame.appendChild(ico);

  let selectedText = selected;
  selectedText.fontName = { family: "Inter", style: "Bold" };
  selectedText.fontSize = 16;
  selectedText.lineHeight = {
    unit: "PIXELS",
    value: 16,
  };
  selectedText.hyperlink = {
    type: "URL",
    value: selectedText.characters,
  };
  selectedText.characters = linkStringHandle(selectedText.characters);
  innerFrame.appendChild(selectedText);

  //createFrame
  const frame = figma.createFrame();
  frame.name = `${returnData.iframe.meta.title}`;
  let fills = clone(frame.fills);
  fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.fills = fills;
  frame.cornerRadius = 6;
  frame.resize(400, 180);
  frame.x = returnData.x;
  frame.y = returnData.y;
  frame.layoutMode = "VERTICAL";
  frame.layoutAlign = "STRETCH";
  frame.itemSpacing = 16;
  frame.paddingTop = 20;
  frame.paddingBottom = 20;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  let shadowEffect = {
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 8,
    spread: -2,
    visible: true,
    blendMode: "HARD_LIGHT",
  };
  frame.effects = [shadowEffect];

  //append
  frame.appendChild(titleNode);
  frame.appendChild(desNode);
  frame.appendChild(innerFrame);

  figma.closePlugin();
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "returnData":
      const nodes = figma.currentPage.selection;
      if (nodes.length > 0) {
        nodes.forEach((node) => {
          console.log(msg, "msg");
          let imageIco;
          if (msg.returnData.icoImg !== undefined) {
            imageIco = figma.createImage(msg.returnData.icoImg);
          }
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
        figma.notify("Please select a text layer");
        figma.closePlugin();
      }
      break;
    case "error":
      figma.notify(`${msg.msg}, Please try again`);
      figma.closePlugin();
      break;
    case "cancel":
      figma.closePlugin();
      break;
    default:
      break;
  }
};
