require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function getResources() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mi_proyecto/rocksFountains/',
      resource_type: 'image',
      max_results: 100
    });
    
    const videos = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'mi_proyecto/rocksFountains/',
      resource_type: 'video',
      max_results: 100
    });

    console.log('IMAGES:');
    result.resources.forEach(r => console.log(r.secure_url));
    console.log('\nVIDEOS:');
    videos.resources.forEach(r => console.log(r.secure_url));
  } catch (error) {
    console.error(error);
  }
}

getResources();
