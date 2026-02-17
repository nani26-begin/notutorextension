import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                isSubscribed: true,
                subscriptionDate: new Date(),
            },
        });

        return NextResponse.json({ message: "All content unlocked successfully" });
    } catch (error) {
        console.error("Error unlocking content:", error);
        return NextResponse.json({ error: "Failed to unlock content" }, { status: 500 });
    }
}
