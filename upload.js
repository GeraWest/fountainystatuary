require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

function subirCarpeta(dir, baseFolder = "") {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      subirCarpeta(fullPath, `${baseFolder}/${file}`);
    } else {
      if (file.toLowerCase().endsWith(".mp4") || 
          file.toLowerCase().endsWith(".mov") || 
          file.toLowerCase().endsWith(".jpeg") || 
          file.toLowerCase().endsWith(".jpg") || 
          file.toLowerCase().endsWith(".png")) {
        
        const isVideo = file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".mov");
        
        cloudinary.uploader.upload(fullPath, {
          resource_type: isVideo ? "video" : "image",
          folder: `mi_proyecto${baseFolder}`
        })
        .then(result => {
          console.log(`${fullPath} → ${result.secure_url}`);
        })
        .catch(err => console.log(`Error subiendo ${fullPath}:`, err));
      }
    }
  });
}

// Subir videos desde la carpeta img/ que es donde están actualmente
subirCarpeta("./img");
