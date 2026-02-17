import { NextResponse } from "next/server";
import { bbb } from "@/lib/bbb";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        if (!bbb) {
            return NextResponse.json({ message: "BigBlueButton is not configured" }, { status: 500 });
        }

        // Fetch user from DB to get their name and role
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userName = user.name || user.email.split("@")[0] || "Student";
        const meetingID = "live-class-101"; // Generic meeting ID for now
        const meetingName = "Physics: Light & Refraction - Live Session";
        const isAdmin = (user as any).role === "ADMIN";

        // 1. Create the meeting (BBB handles idempotent create)
        await bbb.administration.create({
            name: meetingName,
            meetingID: meetingID,
            attendeePW: "ap",
            moderatorPW: "mp",
        });

        // 2. Generate join URL
        const joinUrl = bbb.monitoring.join({
            fullName: userName,
            meetingID: meetingID,
            password: isAdmin ? "mp" : "ap", // Use moderator password for admins
            userID: user.id,
            redirect: false, // We will handle redirect manually to ensure it works
        });

        return NextResponse.redirect(joinUrl);
    } catch (error: any) {
        console.error("BBB Join Error:", error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}
