import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const adminInfo = {
        name: "Admin",

    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    prisma.$disconnect();
})