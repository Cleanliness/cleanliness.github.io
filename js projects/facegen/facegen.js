function pbClick(button){
    btns = document.getElementsByClassName("paintButton");

    for (b of btns){
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

async function convertClick(){
    if (model == null){
        alert("model not loaded");
        return;
    }
    // update model status
    document.getElementById("model-load-status").innerHTML = "Running...";
    
    // collect img data
    console.log("convert click");
    var c = document.getElementById("sheet");
    var ctx = c.getContext("2d");
    var imgData = ctx.getImageData(0, 0, 400, 400);
    console.log(imgData);

    // replace face grey component with #080808
    for (var i=0;i<imgData.data.length;i+=4) {
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

    // get rgb values
    var input_img = [];
    var r_in = [];
    var g_in = [];
    var b_in = [];
    for (var i=0;i<imgData.data.length;i+=4) {
        r_in.push(imgData.data[i]/255) ; // red
        g_in.push(imgData.data[i + 1]/255); // green
        b_in.push(imgData.data[i + 2]/255); // blue
    }

    input_img = input_img.concat(r_in);
    input_img = input_img.concat(g_in);
    input_img = input_img.concat(b_in);
    console.log("input image printttt")
    console.log(input_img);
    // run through model
    input_img = new ort.Tensor('float32', input_img, [1, 3, 200, 200]);
    console.log(input_img);
    input_img = {"demo input": input_img};
    res = await model.run(input_img);
    document.getElementById("model-load-status").innerHTML = "Generated result";

    // get model result
    var out_raw = res["demo output"].data;
    var model_out_img = new Uint8ClampedArray(160000);

    var i = 0;
    for (var pos = 0; pos < out_raw.length/3; pos++){
        model_out_img[i] = out_raw[pos]*255;
        model_out_img[i+1] = out_raw[pos+40000]*255;
        model_out_img[i+2] = out_raw[pos+80000]*255;
        model_out_img[i+3] = 255;
        i+=4;
    }
    
    // draw result on canvas
    var ctx = out_canv.getContext("2d");
    var idat = ctx.createImageData(200, 200);
    idat.data.set(model_out_img);
    ctx.putImageData(idat, 0, 0);

    console.log(model_out_img);
    // debug view transformed image
    // tmpCtx2.putImageData(imgData, 0, 0);
    // const dataUrl = tempCanvas2.toDataURL("png");
    // console.log(dataUrl);
    // const win = window.open(dataUrl, '_blank');
}

async function loadModel(){
    const sess = await ort.InferenceSession.create("./unet-patchgan.onnx");
    model = sess;
    document.getElementById("model-load-status").innerHTML = "Model Loaded";
    return sess;
}

// global variables
model = null;

// load model
loadModel()

// set up output canvas
out_canv = document.getElementById("output-canvas");
var ctx = out_canv.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, out_canv.width, out_canv.height);

// set up input canvas
var canvas = new fabric.Canvas('sheet');
canvas.setBackgroundColor("#000000", canvas.renderAll.bind(canvas));
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 7;
canvas.freeDrawingBrush.color = "#ff0000";
console.log(canvas);




