require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Secret Check:', process.env.CLOUDINARY_API_SECRET ? `${process.env.CLOUDINARY_API_SECRET.slice(0, 3)}...${process.env.CLOUDINARY_API_SECRET.slice(-3)}` : 'MISSING');
console.log('Secret Length:', process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.length : 0);

const publicId = 'Screen_Recording_2026-01-27_175011_nfzlkp';

console.log("--- DEBUGGING RESOURCE TYPES ---");

// Test 1: Signed Upload (Standard)
const urlSignedUpload = cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'upload',
    format: 'mp4',
    sign_url: true,
    version: "1770871882",
    analytics: false
});

// Test 2: Signed Authenticated
const urlSignedAuth = cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'authenticated',
    format: 'mp4',
    sign_url: true,
    version: "1770871882",
    analytics: false
});

console.log('Signed (Upload):', urlSignedUpload);
console.log('Signed (Authenticated):', urlSignedAuth);

console.log('Limited URL:', urlLimited);
console.log('Full URL:', urlFull);
