import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { content, userId } = await req.json()

        if (content === undefined || !userId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        // Upsert note: Update if exists, Create if not
        // In a real app, you'd check which lesson this note is for.
        // For now, we'll store one main note per user.
        const note = await prisma.note.upsert({
            where: { userId }, // Using userId as id for simplicity in this demo, or find by userId
            update: { content },
            create: {
                content,
                userId
            },
        })

        return NextResponse.json(note, { status: 200 })
    } catch (error) {
        console.error("Notes error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 })
        }

        const note = await prisma.note.findFirst({
            where: { userId },
            orderBy: { updatedAt: "desc" }
        })

        return NextResponse.json(note || { content: "" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
