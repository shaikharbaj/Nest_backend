import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  console.log('role seeding start...!');
  //seed role........
  const roles = [{ name: 'ADMIN' }, { name: 'SUBADMIN' }, { name: 'USER' }];

  //check adminrole exist or not if not exist then only create....
  for (const i of roles) {
    const exist = await prisma.roles.findFirst({
      where: {
        name: i.name,
      },
    });

    if (!exist) {
      //add role to database....
      await prisma.roles.create({
        data: {
          name: i.name,
        },
      });
    }
  }
  console.log('role seeded successfully.....!');
  const adminRole = await prisma.roles.findFirst({ where: { name: "ADMIN" } });
  console.log('admin info seeding start...!');
  // const adminInfo = {
  //   name: 'Admin',
  //   email: 'admin@gmail.com',
  //   password: 'Admin@123',
  // };
  const hashedpassword = await bcrypt.hash('Admin@123', 10);
  //find admin role id...
  //check admin already present or not...
  const admin = await prisma.user.upsert({
    where: { id: 1 },
    update: {

    },
    create: {
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
      role_id: Number(adminRole.id),
    },
  })
  console.log('admin data seeded successfully....!');
  // const checkadminpresent = await prisma.user.findFirst({
  //   where: {
  //     email: adminInfo.email,
  //   },
  // });
  // if (!checkadminpresent) {
  //   const adminRole = await prisma.roles.findFirst({
  //     where: {
  //       name: 'ADMIN',
  //     },
  //   });
  //   const user = await prisma.user.create({
  //     data: {
  //       name: 'Admin',
  //       email: 'admin@gmail.com',
  //       password: hashedpassword,
  //       user_information: {
  //         create: {
  //           phone_number: '7028504876',
  //           data_of_birth: new Date('2001-05-10'),
  //           street: 'Jalgaon',
  //           city: 'Jalgaon',
  //           state: 'Maharashtra',
  //           zipcode: '413723',
  //         },
  //       },
  //       role_id: Number(adminRole.id),
  //     },
  //   });
  //   console.log('data seeded successfully....!');
  // } else {
  //   console.log('admin alredy present.....!');
  // }

}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
