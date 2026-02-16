const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (user) {
            console.log('User found:', user.email);
            console.log('isSubscribed:', user.isSubscribed);
        } else {
            console.log('No users found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
