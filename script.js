const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const extractBtn = document.getElementById("extractBtn");
const output = document.getElementById("output");

const video = document.getElementById("video");
const cameraBtn = document.getElementById("cameraBtn");
const captureBtn = document.getElementById("captureBtn");
const removeBtn = document.getElementById("removeBtn");

let imageFile = null;
let stream = null;


/* Upload from gallery */

fileInput.addEventListener("change",(e)=>{

const file = e.target.files[0];

if(!file) return;

imageFile = file;

preview.src = URL.createObjectURL(file);

preview.style.display="block";

removeBtn.style.display="block";

});


/* Open Camera */

cameraBtn.onclick = async ()=>{

try{

stream = await navigator.mediaDevices.getUserMedia({video:true});

video.srcObject = stream;

video.style.display="block";

captureBtn.style.display="inline-block";

}catch(err){

alert("Camera permission denied or camera not available");

}

};


/* Capture Photo */

captureBtn.onclick = ()=>{

const canvas = document.createElement("canvas");

canvas.width = video.videoWidth;

canvas.height = video.videoHeight;

const ctx = canvas.getContext("2d");

ctx.drawImage(video,0,0);

canvas.toBlob((blob)=>{

imageFile = new File([blob],"capture.png",{type:"image/png"});

preview.src = URL.createObjectURL(imageFile);

preview.style.display="block";

removeBtn.style.display="block";

});

stream.getTracks().forEach(track=>track.stop());

video.style.display="none";

captureBtn.style.display="none";

};


/* Remove Image */

removeBtn.onclick=()=>{

preview.src="";

preview.style.display="none";

removeBtn.style.display="none";

imageFile=null;

fileInput.value="";

};


/* Extract Text */

extractBtn.onclick = async ()=>{

if(!imageFile){

alert("Please upload or capture an image");

return;

}

output.innerText="Processing image...";

try{

const formData = new FormData();

formData.append("image",imageFile);

const res = await fetch(
"https://img-to-text-ten.vercel.app/text",
{
method:"POST",
body:formData
}
);

const data = await res.json();

console.log(data);

output.innerText=data || "No text detected";

}catch(err){

console.error(err);

output.innerText="Error extracting text.";

}

};