import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
    console.log('admin info seeding start...!');
    const adminInfo = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin@123',
    };
    const hashedpassword = await bcrypt.hash('Admin@123', 10);
    //find admin role id...
    //check admin already present or not...
    const checkadminpresent = await prisma.user.findFirst({
        where: {
            email: adminInfo.email
        }
    })
    if (!checkadminpresent) {
        const adminRole = await prisma.roles.findFirst({
            where: {
                name: 'ADMIN',
            },
        });
        const user = await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedpassword,
                user_information: {
                    create: {
                        phone_number: '7028504876',
                        data_of_birth: new Date('2001-05-10'),
                        street: 'Jalgaon',
                        city: 'Jalgaon',
                        state: 'Maharashtra',
                        zipcode: '413723',
                    },
                },
                role_id: Number(adminRole.id)
            },
        });
        console.log('data seeded successfully....!');
    } else {
        console.log("admin alredy present.....!")
    }
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
