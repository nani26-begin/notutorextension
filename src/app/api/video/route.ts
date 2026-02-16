import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const { videoId, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: User ID required' }, { status: 401 });
        }

        if (!videoId) {
            return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
        }

        // Fetch user from DB to get latest subscription status
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isSubscribed: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isSubscribed = user.isSubscribed;

        // Base public ID of your video on Cloudinary
        const publicId = 'Screen_Recording_2026-01-27_175011_nfzlkp';

        let transformation = {};

        let accessLevel = 'limited';
        let timeLimit = 120; // 2 minutes

        // Generate Signed URL
        // If not subscribed, limit duration to 120 seconds using 'end_offset' (eo_120)
        if (!isSubscribed) {
            transformation = { end_offset: "120" };
        } else {
            accessLevel = 'full';
            timeLimit = -1; // Unlimited
            // No transformation needed for full video, or maybe explicit quality settings
        }

        // Generate the URL
        const videoUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            format: 'mp4',
            sign_url: true, // This generates a signed URL
            ...transformation
        });

        // Add a query param for frontend logic (displaying "Limited" text, etc.)
        // Note: The signature validates the transformation (eo_120). 
        // Changing the URL params manually will break the signature and Cloudinary will reject it.
        const finalizedUrl = isSubscribed ? `${videoUrl}&access=full` : `${videoUrl}&access=limited`;

        return NextResponse.json({
            videoUrl: finalizedUrl,
            accessLevel,
            timeLimit,
            isSubscribed
        });

    } catch (error) {
        console.error('Video API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
