/*
 Basic File I/O for displaying
 Skeleton Author: Joshua A. Levine
 Modified by: Amir Mohammad Esmaieeli Sikaroudi
 Email: amesmaieeli@email.arizona.edu
 */

//access DOM elements we'll use
var input = document.getElementById("load_image");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var ppm_img_data;
var angle = 0; // Rotation angle in degrees
var intervalTime = 200; // ~60 FPS
var offscreenCanvas, offscreenCtx;


//Function to process upload
var upload = function () {
   if (input.files.length > 0) {
       var file = input.files[0];
       console.log("You chose", file.name);
       if (file.type) console.log("It has type", file.type);
       var fReader = new FileReader();
       fReader.readAsBinaryString(file);


       fReader.onload = function(e) {
           //if successful, file data has the contents of the uploaded file
           var file_data = fReader.result;
           parsePPM(file_data);
           startRotation(); // Start animation
       };
   }
};


// Load PPM Image to Canvas
function parsePPM(file_data){
   /*
  * Extract header
  */
   var format = "";
   var width = 0;
   var height = 0;
   var max_v = 0;
   var lines = file_data.split(/#[^\n]*\s*|\s+/); // split text by whitespace or text following '#' ending with whitespace
   var counter = 0;
   // get attributes
   for(var i = 0; i < lines.length; i ++){
       if(lines[i].length == 0) {continue;} //in case, it gets nothing, just skip it
       if(counter == 0){
           format = lines[i];
       }else if(counter == 1){
           width = lines[i];
       }else if(counter == 2){
           height = lines[i];
       }else if(counter == 3){
           max_v = Number(lines[i]);
       }else if(counter > 3){
           break;
       }
       counter ++;
   }
   console.log("Format: " + format);
   console.log("Width: " + width);
   console.log("Height: " + height);
   console.log("Max Value: " + max_v);
   /*
    * Extract Pixel Data
    */
   var bytes = new Uint8Array(3 * width * height);  // i-th R pixel is at 3 * i; i-th G is at 3 * i + 1; etc.
   // i-th pixel is on Row i / width and on Column i % width
   // Raw data must be last 3 X W X H bytes of the image file
   var raw_data = file_data.substring(file_data.length - width * height * 3);
   for(var i = 0; i < width * height * 3; i ++){
       // convert raw data byte-by-byte
       bytes[i] = raw_data.charCodeAt(i);
   }


   // Crop the image to be a square by removing extra rows or cols of pixels
   var new_size;
   var left_trim = 0, right_trim = 0, top_trim = 0, bottom_trim = 0;


   if (width > height) {
       // Image is wider than it is tall, remove columns
       new_size = height;
       var crop_width = width - new_size;
       left_trim = Math.floor(crop_width / 2);
       right_trim = crop_width - left_trim;
   } else {
       // Image is taller than it is wide or already square, remove rows if needed
       new_size = width;
       var crop_height = height - new_size;
       top_trim = Math.floor(crop_height / 2);
       bottom_trim = crop_height - top_trim;
   }


   // Create cropped image data
   var new_bytes = new Uint8Array(3 * new_size * new_size);


   for (var y = 0; y < new_size; y++) {
       for (var x = 0; x < new_size; x++) {
           var old_x = x + left_trim;
           var old_y = y + top_trim;
           var old_index = (old_y * width + old_x) * 3;
           var new_index = (y * new_size + x) * 3;
           new_bytes.set(bytes.subarray(old_index, old_index + 3), new_index);
       }
   }


   // Update canvas dimensions
   document.getElementById("canvas").setAttribute("width", new_size);
   document.getElementById("canvas").setAttribute("height", new_size);


   // Update image data
   var image_data = ctx.createImageData(new_size, new_size);


   for (var i = 0; i < image_data.data.length; i += 4) {
       let pixel_pos = parseInt(i / 4);
       image_data.data[i + 0] = new_bytes[pixel_pos * 3 + 0]; // red
       image_data.data[i + 1] = new_bytes[pixel_pos * 3 + 1]; // green
       image_data.data[i + 2] = new_bytes[pixel_pos * 3 + 2]; // blue
       image_data.data[i + 3] = 255; // alpha (set to opaque)
   }


   ctx.putImageData(image_data, canvas.width / 2 - new_size / 2, canvas.height / 2 - new_size / 2);
   ppm_img_data = ctx.getImageData(0, 0, new_size, new_size);


   // Modify the image in offscreen canonical volume
   offscreenCanvas = document.createElement("canvas");
   offscreenCtx = offscreenCanvas.getContext("2d");
   offscreenCanvas.width = new_size;
   offscreenCanvas.height = new_size;
   offscreenCtx.putImageData(image_data, 0, 0);
}


// Function to compute the rotation matrix using Mat2
function getTransformMatrix(theta) {
   // Calculate sine and cosine of input angle (convert input to radians)
   let cosT = Math.cos(theta * Math.PI / 180);
   let sinT = Math.sin(theta * Math.PI / 180);


   // Scale matrix
   let S_mat = Mat2.identity().sMult(1 / (Math.abs(cosT) + Math.abs(sinT)));


   // Rotation matrix
   let R_mat = new Mat2(
       cosT, -sinT,
       sinT, cosT
   );


   // Return scaled rotation matrix
   return S_mat.mMult(R_mat);
}


// Function to start rotation animation
function startRotation() {
   setInterval(() => {
       if (!ppm_img_data) return; // Confirm image is loaded


       angle = (angle + 5) % 360; // Increment angle by 5 degrees
       let rotationMatrix = getTransformMatrix(angle);



       ctx.clearRect(0, 0, canvas.width, canvas.height);
       ctx.save();
       ctx.translate(canvas.width / 2, canvas.height / 2);
       ctx.transform(
           rotationMatrix.m[0][0], rotationMatrix.m[1][0],
           rotationMatrix.m[0][1], rotationMatrix.m[1][1],
           0, 0
       );
    
       

       // Draw image on canvas
       ctx.drawImage(offscreenCanvas, -ppm_img_data.width / 2, -ppm_img_data.height / 2);
       ctx.restore();
       showMatrix(rotationMatrix.m);

   }, intervalTime);
}



// Show transformation matrix on HTML
function showMatrix(matrix){
    for(let i=0;i<matrix.length;i++){
        for(let j=0;j<matrix[i].length;j++){
            matrix[i][j]=Math.floor((matrix[i][j]*100))/100;
        }
    }
    document.getElementById("row1").innerHTML = "row 1:[ " + matrix[0].toString().replaceAll(",",",\t") + " ]";
    document.getElementById("row2").innerHTML = "row 2:[ " + matrix[1].toString().replaceAll(",",",\t") + " ]";
}


//Connect event listeners
input.addEventListener("change", upload);

