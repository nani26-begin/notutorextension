
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabase() {
    try {
        console.log("Attempting to connect to SQLite...");
        // Try to create or find a user
        const email = 'test-' + Date.now() + '@example.com';
        const user = await prisma.user.create({
            data: {
                email: email,
                password: 'password123',
                name: 'Test User',
                role: 'STUDENT'
            }
        });
        console.log('Successfully created user in SQLite:', user);

        // Try to create a verification token
        const token = await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: '123456',
                expires: new Date(Date.now() + 600000)
            }
        });
        console.log('Successfully created verification token:', token);

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } });
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: '123456'
                }
            }
        });
        console.log('Cleanup successful.');

    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();
