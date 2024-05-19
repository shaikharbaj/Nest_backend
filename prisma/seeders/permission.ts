import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { userModulePermission, categoryModulePermission, subCategoryModulePermission, blogModulePermissions, bannerModulePermission, productModulePermission } from '../../src/constants/permissions';
const prisma = new PrismaClient();

async function main() {
    const adminRole = await prisma.roles.findFirst({ where: { name: "ADMIN" } });
    const admin = await prisma.user.findFirst({ where: { role_id: adminRole.id } })
    console.log("permission seeding start....!");
    // user model permission
    await prisma.permissions.upsert({
        where: { slug: userModulePermission.LIST },
        update: {},
        create: {
            description: "the permission allow logged in user can list the user",
            slug: userModulePermission.LIST,
            module: 'USER',
            permission_name: "list the user",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: userModulePermission.ADD },
        update: {},
        create: {
            description: "the permission allow logged in user to add the user",
            slug: userModulePermission.ADD,
            module: 'USER',
            permission_name: "add the user",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: userModulePermission.UPDATE },
        update: {},
        create: {
            description: "the permission allow logged in user to update the user",
            slug: userModulePermission.UPDATE,
            module: 'USER',
            permission_name: "edit the user",
            createdBy: Number(admin.id), isActive: true
        }
    })

    // await prisma.permissions.upsert({
    //     where: { slug: userModulePermission.DELETE },
    //     update: {},
    //     create: {
    //         description: "the permission allow logged in user to delete the user",
    //         slug: userModulePermission.DELETE,
    //         module: 'USER',
    //         permission_name: "delete the user",
    //         createdBy: Number(admin.id), isActive: true
    //     }
    // })

    await prisma.permissions.upsert({
        where: { slug: userModulePermission.Toggle },
        update: {},
        create: {
            description: "the permission allow logged in user to toggle the permission of user",
            slug: userModulePermission.Toggle,
            module: 'USER',
            permission_name: "toggle status of the user",
            createdBy: Number(admin.id), isActive: true
        }
    })

    //user module end 
    //categoty module start....
    await prisma.permissions.upsert({
        where: { slug: categoryModulePermission.LIST },
        update: {},
        create: {
            description: "the permission allow logged in user to List the category",
            slug: categoryModulePermission.LIST,
            module: 'CATEGORIES',
            permission_name: "list the categories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: categoryModulePermission.ADD },
        update: {},
        create: {
            description: "the permission allow logged in user to ADD the category",
            slug: categoryModulePermission.ADD,
            module: 'CATEGORIES',
            permission_name: "add the categories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: categoryModulePermission.UPDATE },
        update: {},
        create: {
            description: "the permission allow logged in user to update the category",
            slug: categoryModulePermission.UPDATE,
            module: 'CATEGORIES',
            permission_name: "update the categories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: categoryModulePermission.DELETE },
        update: {},
        create: {
            description: "the permission allow logged in user to delete the category",
            slug: categoryModulePermission.DELETE,
            module: 'CATEGORIES',
            permission_name: "delete the categories",
            createdBy: Number(admin.id), isActive: true
        }
    })
    //category permision seeding end ....
    //subcategory seeding start.......
    await prisma.permissions.upsert({
        where: { slug: subCategoryModulePermission.LIST },
        update: {},
        create: {
            description: "the permission allow logged in user to list the subcategory",
            slug: subCategoryModulePermission.LIST,
            module: 'SUBCATEGORIES',
            permission_name: "list the subcategories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: subCategoryModulePermission.ADD },
        update: {},
        create: {
            description: "the permission allow logged in user to add the subcategory",
            slug: subCategoryModulePermission.ADD,
            module: 'SUBCATEGORIES',
            permission_name: "add the subcategories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: subCategoryModulePermission.UPDATE },
        update: {},
        create: {
            description: "the permission allow logged in user to update the subcategory",
            slug: subCategoryModulePermission.UPDATE,
            module: 'SUBCATEGORIES',
            permission_name: "edit the subcategories",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: subCategoryModulePermission.DELETE },
        update: {},
        create: {
            description: "the permission allow logged in user to delete the subcategory",
            slug: subCategoryModulePermission.DELETE,
            module: 'SUBCATEGORIES',
            permission_name: "delete the subcategories",
            createdBy: Number(admin.id), isActive: true
        }
    })
    //subcategory seeding end

    //banner permission seeding start
    await prisma.permissions.upsert({
        where: { slug: bannerModulePermission.LIST },
        update: {},
        create: {
            description: "the permission allow logged in user to list the banner",
            slug: bannerModulePermission.LIST,
            module: 'BANNER',
            permission_name: "list the banner",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: bannerModulePermission.ADD },
        update: {},
        create: {
            description: "the permission allow logged in user to add the banner",
            slug: bannerModulePermission.ADD,
            module: 'BANNER',
            permission_name: "add the banner",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: bannerModulePermission.UPDATE },
        update: {},
        create: {
            description: "the permission allow logged in user to update the banner",
            slug: bannerModulePermission.UPDATE,
            module: 'BANNER',
            permission_name: "update the banner",
            createdBy: Number(admin.id), isActive: true
        }
    })
    await prisma.permissions.upsert({
        where: { slug: bannerModulePermission.DELETE },
        update: {},
        create: {
            description: "the permission allow logged in user to delete the banner",
            slug: bannerModulePermission.DELETE,
            module: 'BANNER',
            permission_name: "delete the banner",
            createdBy: Number(admin.id), isActive: true
        }
    })

    //banner permision seeded successfully!
    //blog permission seeding start.....
    await prisma.permissions.upsert({
        where: { slug: blogModulePermissions.LIST },
        update: {},
        create: {
            description: "the permission allow logged in user to list the blogs",
            slug: blogModulePermissions.LIST,
            module: 'BLOGS',
            permission_name: "list the blogs",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: blogModulePermissions.ADD },
        update: {},
        create: {
            description: "the permission allow logged in user to add the blogs",
            slug: blogModulePermissions.ADD,
            module: 'BLOGS',
            permission_name: "add the blogs",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: blogModulePermissions.UPDATE },
        update: {},
        create: {
            description: "the permission allow logged in user to update the blogs",
            slug: blogModulePermissions.UPDATE,
            module: 'BLOGS',
            permission_name: "update the blogs",
            createdBy: Number(admin.id), isActive: true
        }
    })

    await prisma.permissions.upsert({
        where: { slug: blogModulePermissions.DELETE },
        update: {},
        create: {
            description: "the permission allow logged in user to delete the blogs",
            slug: blogModulePermissions.DELETE,
            module: 'BLOGS',
            permission_name: "update the blogs",
            createdBy: Number(admin.id), isActive: true
        }
    })

    //product module permission seeding start....
    await prisma.permissions.upsert({
        where:{slug:productModulePermission.LIST},
        update:{},
        create:{
            description: "the permission allow logged in user to list the product",
            slug: productModulePermission.LIST,
            module: 'PRODUCTS',
            permission_name: "list the product",
            createdBy: Number(admin.id), isActive: true  
        }
    })

    await prisma.permissions.upsert({
        where:{slug:productModulePermission.ADD},
        update:{},
        create:{
            description: "the permission allow logged in user to ADD the product",
            slug: productModulePermission.ADD,
            module: 'PRODUCTS',
            permission_name: "add the product",
            createdBy: Number(admin.id), isActive: true  
        }
    })

    await prisma.permissions.upsert({
        where:{slug:productModulePermission.UPDATE},
        update:{},
        create:{
            description: "the permission allow logged in user to UPDATE the product",
            slug: productModulePermission.UPDATE,
            module: 'PRODUCTS',
            permission_name: "update the product",
            createdBy: Number(admin.id), isActive: true  
        }
    })
    await prisma.permissions.upsert({
        where:{slug:productModulePermission.DELETE},
        update:{},
        create:{
            description: "the permission allow logged in user to DELETE the product",
            slug: productModulePermission.DELETE,
            module: 'PRODUCTS',
            permission_name: "delete the product",
            createdBy: Number(admin.id), isActive: true  
        }
    })
    console.log("permission seeding end...!");
    //permission seeding end:

}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
