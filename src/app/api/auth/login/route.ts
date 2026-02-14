import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        console.log('Login attempt started')

        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is not defined in environment variables')
            return NextResponse.json({ message: 'Database configuration missing' }, { status: 500 })
        }

        const { email, password } = await request.json()
        console.log(`Login attempt for email: ${email}`)

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            console.log(`User not found for email: ${email}`)
            return NextResponse.json(
                { message: 'you are new user so you have to signup' },
                { status: 404 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            console.log(`Invalid password for email: ${email}`)
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        console.log(`Login successful for user: ${user.id}`)
        return NextResponse.json(
            { message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('CRITICAL LOGIN ERROR:', error)
        return NextResponse.json(
            {
                message: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        )
    }
}
