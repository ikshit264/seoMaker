import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TEAMS = Array.from({ length: 7 }, (_, i) => ({
    name: `Team ${i}`,
    email: `team${i}@entrext.com`,
    password: `passteam${i}`
}));

async function main() {
    console.log('Seeding database via Prisma...');

    // Clear existing team users for idempotency
    await prisma.user.deleteMany({
        where: {
            email: {
                endsWith: '@entrext.com'
            }
        }
    });

    for (const team of TEAMS) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(team.password, salt);

        const existingUser = await prisma.user.findUnique({
            where: { email: team.email }
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    name: team.name,
                    email: team.email,
                    password: hashedPassword,
                }
            });
            console.log(`Created ${team.email}`);
        } else {
            console.log(`User ${team.email} already exists. Skipping.`);
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
