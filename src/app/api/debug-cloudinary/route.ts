import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const publicId = 'Screen_Recording_2026-01-27_175011_nfzlkp';

        // Generate URL without signature (to test access)
        const urlUnsigned = cloudinary.url(publicId, {
            resource_type: 'video',
            format: 'mp4',
            version: "1770871882"
        });

        // Generate Signed URL
        const urlSigned = cloudinary.url(publicId, {
            resource_type: 'video',
            format: 'mp4',
            sign_url: true,
            version: "1770871882",
            end_offset: "120",
            analytics: false
        });

        // Generate Signed URL - Full
        const urlSignedFull = cloudinary.url(publicId, {
            resource_type: 'video',
            format: 'mp4',
            sign_url: true,
            version: "1770871882",
            analytics: false
        });

        return NextResponse.json({
            config: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                // Mask secret
                api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING'
            },
            urlUnsigned,
            urlSigned,
            urlSignedFull
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
