import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        // Logic for "Signed URL" (Mocked for now)
        const baseUrl = `https://res.cloudinary.com/dl0jkdtj6/video/upload/v1770871882/Screen_Recording_2026-01-27_175011_nfzlkp.mp4`;

        let videoUrl = baseUrl;
        let accessLevel = 'limited';
        let timeLimit = 120; // 2 minutes in seconds

        if (isSubscribed) {
            accessLevel = 'full';
            timeLimit = -1; // Unlimited
            videoUrl = `${baseUrl}?access=full&token=mock_signed_token_full`;
        } else {
            videoUrl = `${baseUrl}?access=limited&token=mock_signed_token_limited`;
        }

        return NextResponse.json({
            videoUrl,
            accessLevel,
            timeLimit,
            isSubscribed
        });

    } catch (error) {
        console.error('Video API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
