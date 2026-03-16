import { PrismaClient } from '@prisma/client';

async function test() {
    const url = 'mongodb+srv://ikshittalera:ikshittalera@cluster0.kbot2rm.mongodb.net/upvote?retryWrites=true&w=majority&appName=Cluster0';
    const prisma = new PrismaClient({
        datasources: {
            db: { url }
        }
    });

    try {
        console.log('Connecting via Prisma...');
        await prisma.$connect();
        console.log('Success!');
        const tables = await prisma.$runCommandRaw({ listCollections: 1 });
        console.log(tables);
    } catch (err) {
        console.error('Prisma Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
