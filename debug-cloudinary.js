require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = 'Screen_Recording_2026-01-27_175011_nfzlkp';

const urlLimited = cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'mp4',
    sign_url: true,
    version: "1770871882",
    end_offset: "120"
});

const urlFull = cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'mp4',
    sign_url: true,
    version: "1770871882"
});

console.log('Limited URL:', urlLimited);
console.log('Full URL:', urlFull);
