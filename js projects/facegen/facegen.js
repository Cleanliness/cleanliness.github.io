function pbClick(button){
    btns = document.getElementsByClassName("paintButton");

    for (b of btns){
        console.log(b);
        b.style["border"] = "none";
    }

    button.style["border"] = "2px solid #4f4f4f";
    console.log(button.style["background-color"]);
    canvas.freeDrawingBrush.color = button.style["background-color"];
}

function clearClick(){
    console.log("clear click");
    canvas.clear();
}

function sliderClick(slider){
    console.log(slider.value);
    canvas.freeDrawingBrush.width = slider.value;
}

function convertClick(){
    console.log("convert click");
    var c = document.getElementById("sheet");
    var ctx = c.getContext("2d");
    var imgData = ctx.getImageData(0, 0, 400, 400);
    console.log(imgData);

    // replace face grey component with #080808
    for (var i=0;i<imgData.data.length;i+=4)
    {
        // is this pixel the old rgb?
        if(imgData.data[i]==160 &&
           imgData.data[i+1]==160 &&
           imgData.data[i+2]==160
        ){
            // change to your new rgb
            imgData.data[i]=128;
            imgData.data[i+1]=128;
            imgData.data[i+2]=128;
        }
    }

    // scale image by 1/2
    var tempCanvas = document.createElement("CANVAS");
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    var tmpCtx = tempCanvas.getContext("2d");
    tmpCtx.putImageData(imgData, 0, 0);
    tmpCtx.scale(0.5, 0.5);
    tmpCtx.drawImage(tempCanvas, 0, 0);

    // crop 200x200
    tempCanvas2 = document.createElement("CANVAS");
    tempCanvas2.width = 200;
    tempCanvas2.height = 200;
    var tmpCtx2 = tempCanvas2.getContext("2d");
    imgData = tmpCtx.getImageData(0, 0, 200, 200);

    // debug view transformed image
    // tmpCtx2.putImageData(imgData, 0, 0);
    // const dataUrl = tempCanvas2.toDataURL("png");
    // console.log(dataUrl);
    // const win = window.open(dataUrl, '_blank');
}

async function loadModel(){
    const sess = await ort.InferenceSession.create("./unet-patchgan.onnx");
    console.log(sess);
}
loadModel();
var canvas = new fabric.Canvas('sheet');
canvas.setBackgroundColor("#000000", canvas.renderAll.bind(canvas));
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 7;
canvas.freeDrawingBrush.color = "#ff0000";
console.log(canvas);




