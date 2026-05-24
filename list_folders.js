require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function listFolders() {
  try {
    const result = await cloudinary.api.root_folders();
    console.log('Root Folders:', result.folders);
    
    for (const folder of result.folders) {
      const sub = await cloudinary.api.sub_folders(folder.path);
      console.log(`Subfolders of ${folder.path}:`, sub.folders);
      for (const s of sub.folders) {
          const subsub = await cloudinary.api.sub_folders(s.path);
          console.log(`Subfolders of ${s.path}:`, subsub.folders);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

listFolders();
