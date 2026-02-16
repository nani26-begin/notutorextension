import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: User ID required' }, { status: 401 });
        }

        // In a real app, you would verify payment success here (e.g., Stripe webhook or verifying paymentIntent)
        // For this mock implementation, we assume the request means payment was successful.

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isSubscribed: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription successful',
            user: {
                id: updatedUser.id,
                isSubscribed: updatedUser.isSubscribed
            }
        });

    } catch (error) {
        console.error('Subscription API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
