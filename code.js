figma.showUI(__html__);
figma.ui.resize(400, 520);

const link = "https://logo.clearbit.com/baidu.com";
const selected = figma.currentPage.selection[0];

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

// async function aa(node) {
//   let res = new XMLHttpresuest();
//   res.open("GET", link, true);
//   res.responseType = "arraybuffer";

//   res.onreadystatechange = () => {
//     let arrayBuffer = res.response;
//     if (arrayBuffer) {
//       let imageArray = new Uint8Array(arrayBuffer._bodybuf);
//       const img = figma.createImage(imageArray);

//       let fills = clone(node.fills);
//       fills.push({ type: "IMAGE", scaleMode: "FILL", imageHash: img.hash });
//       node.fills = fills;
//       console.log(node.fills);
//     }
//   };
// }
// // console.log(selected.fills);

// aa(selected);

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
      case 'create-logo':
        const nodes = figma.currentPage.selection
        if (nodes.length > 0) {
          nodes.forEach((node) => {
            let image = figma.createImage(msg.imageArray)
            if (node.type !== 'SLICE' && node.type !== 'GROUP') {
              let fills = clone(node.fills)
              fills.push({ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash })
              node.fills = fills
            }
          })
        } else {
          figma.notify('Please select a layer')
        }
        break
  
      case 'error':
        // console.log(msg.e);
        // figma.notify(msg.e);
        break
      case 'cancel':
        figma.closePlugin()
        break
      default:
        break
    }
  }
