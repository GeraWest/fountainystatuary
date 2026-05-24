require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function listAll() {
  try {
    const result = await cloudinary.search
      .expression('folder:mi_proyecto/ball AND 36')
      .execute();
    console.log('SEARCH RESULTS (Ball 36):', result.resources.map(r => ({ public_id: r.public_id, url: r.secure_url, resource_type: r.resource_type })));
  } catch (error) {
    console.error(error);
  }
}

listAll();
