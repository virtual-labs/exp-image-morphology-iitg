window.Module = {
onRuntimeInitialized() {
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
initApp();
}
};

function initApp(){

const imageInput = document.getElementById("imageInput");
const kernelSize = document.getElementById("kernelSize");
const kernelVal = document.getElementById("kernelVal");
const kernelShape = document.getElementById("kernelShape");
const threshold = document.getElementById("threshold");
const threshVal = document.getElementById("threshVal");
const comboMode = document.getElementById("comboMode");

const originalCanvas = document.getElementById("originalCanvas");
const erosionCanvas = document.getElementById("erosionCanvas");
const dilationCanvas = document.getElementById("dilationCanvas");
const comboCanvas = document.getElementById("comboCanvas");

let graySrc = null;

function setProcessing(){
document.getElementById("statusText").textContent="Processing...";
document.getElementById("statusDot").style.background="#ef4444";
}

function setReady(){
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
}

imageInput.addEventListener("change", e=>{
let img = new Image();
img.onload = ()=>{
originalCanvas.width = img.width;
originalCanvas.height = img.height;
originalCanvas.getContext("2d").drawImage(img,0,0);
let mat = cv.imread(originalCanvas);
graySrc = new cv.Mat();
cv.cvtColor(mat, graySrc, cv.COLOR_RGBA2GRAY);
mat.delete();
process();
};
img.src = URL.createObjectURL(e.target.files[0]);
});

kernelSize.oninput = ()=>{
kernelVal.textContent = kernelSize.value;
process();
};

threshold.oninput = ()=>{
threshVal.textContent = threshold.value;
process();
};

kernelShape.onchange = process;
comboMode.onchange = process;

function process(){

if(!graySrc) return;
setProcessing();

let binary = new cv.Mat();
cv.threshold(graySrc, binary, parseInt(threshold.value), 255, cv.THRESH_BINARY);

cv.imshow(originalCanvas, binary);

let shapeMap = {
"rect": cv.MORPH_RECT,
"ellipse": cv.MORPH_ELLIPSE,
"cross": cv.MORPH_CROSS
};

let ksize = parseInt(kernelSize.value);
let kernel = cv.getStructuringElement(shapeMap[kernelShape.value], new cv.Size(ksize, ksize));

let erosion = new cv.Mat();
let dilation = new cv.Mat();
let combo = new cv.Mat();

cv.erode(binary, erosion, kernel);
cv.dilate(binary, dilation, kernel);

if(comboMode.value === "open"){
cv.morphologyEx(binary, combo, cv.MORPH_OPEN, kernel);
}else{
cv.morphologyEx(binary, combo, cv.MORPH_CLOSE, kernel);
}

erosionCanvas.width = dilationCanvas.width = comboCanvas.width = binary.cols;
erosionCanvas.height = dilationCanvas.height = comboCanvas.height = binary.rows;

cv.imshow(erosionCanvas, erosion);
cv.imshow(dilationCanvas, dilation);
cv.imshow(comboCanvas, combo);

binary.delete();
erosion.delete();
dilation.delete();
combo.delete();
kernel.delete();

setReady();
}

}
