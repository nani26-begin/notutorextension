import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        console.log('Signup attempt started')

        if (!process.env.DATABASE_URL) {
            const errorMsg = 'DATABASE_URL is not defined in environment variables';
            console.error(errorMsg);
            return NextResponse.json({ message: errorMsg }, { status: 500 });
        }

        const { name, email, password } = await request.json()
        console.log(`Signup attempt for email: ${email}`)

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Name, email and password are required' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            console.log(`User already exists for email: ${email}`)
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        console.log(`User created successfully: ${user.id}`)
        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('CRITICAL SIGNUP ERROR:', error)
        return NextResponse.json(
            {
                message: 'Internal server error',
                details: error.message
            },
            { status: 500 }
        )
    }
}
