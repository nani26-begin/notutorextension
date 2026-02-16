
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/send-email";
import { generateOTP } from "@/lib/otp";

export async function POST(req: Request) {
    try {
        const { email, type } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Check user existence based on flow type
        const user = await prisma.user.findUnique({ where: { email } });

        if (type === 'login' && !user) {
            return NextResponse.json({ message: "User not found. Please sign up." }, { status: 404 });
        }

        if (type === 'signup' && user) {
            return NextResponse.json({ message: "User already exists. Please login." }, { status: 409 });
        }

        const otp = generateOTP();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete existing OTPs for this email and create new one
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        });

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: otp,
                expires
            }
        });

        // Send Email
        await sendEmail({
            to: email,
            subject: "Your NoTutor Verification Code",
            html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
        });

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ message: "Failed to send OTP", error: error.message }, { status: 500 });
    }
}
