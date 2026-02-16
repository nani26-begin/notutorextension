
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, otp, type, name } = await req.json(); // name is optional, for signup

        if (!email || !otp || !type) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Verify OTP
        const verifiedToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: otp,
                expires: { gt: new Date() }
            }
        });

        if (!verifiedToken) {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }

        // Delete used OTP
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: otp
                }
            }
        });

        let user;

        if (type === 'login') {
            user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
        } else if (type === 'signup') {
            // Create user
            // Use a dummy password since we use OTP. Alternatively, we could remove password from schema but that's a bigger change.
            // We'll generate a random password or just empty string if allowed (but schema says String type, not optional).
            const dummyPassword = Math.random().toString(36).slice(-8); // simple random string

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    password: dummyPassword
                }
            });
        } else {
            return NextResponse.json({ message: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({
            message: "Authentication successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("OTP Verify Error:", error);
        // Handle unique constraint error on signup race condition
        if (error.code === 'P2002') {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }
        return NextResponse.json({ message: "Failed to verify OTP", error: error.message }, { status: 500 });
    }
}
