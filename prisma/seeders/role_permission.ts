import { PrismaClient } from '@prisma/client';
import { userModulePermission, categoryModulePermission, subCategoryModulePermission, blogModulePermissions, bannerModulePermission, productModulePermission, cartModulePermission, orderModulePermission } from '../../src/constants/permissions';
const prisma = new PrismaClient();

async function main() {
    //get all the roles ......
    //  const roles = [{ name: 'ADMIN' }, { name: 'SUBADMIN' }, { name: 'USER' }];
    const adminRole = await prisma.roles.findFirst({ where: { name: "ADMIN" } });
    const subadminRole = await prisma.roles.findFirst({ where: { name: "SUBADMIN" } })
    const userRole = await prisma.roles.findFirst({ where: { name: "USER" } })
    const supplierRole = await prisma.roles.findFirst({ where: { name: "SUPPLIER" } });
    console.log("Seeding role & permission mapping table...");
    await prisma.role_permissions.deleteMany({ where: { role_id: adminRole.id } });
    console.log("admin role-permission seeding start...!");
    const allPermissions = await prisma.permissions.findMany({ where: { isActive: true } });
    if (allPermissions.length > 0) {
        const adminPermissions = [];
        allPermissions.forEach((permission: any, permissionIndex: number) => {
            adminPermissions.push({
                role_id: adminRole.id,
                permission_id: permission.id
            });
        });
        await prisma.role_permissions.createMany({ data: adminPermissions });
        console.log("admin role-permission seeding end...!");
        //admin role permission seeded.......
        //subadmin role permission start.....
        console.log("subadmin role-permission seeding start...!");
        await prisma.role_permissions.deleteMany({ where: { role_id: subadminRole.id } });
        const subadminnpermissions = await prisma.permissions.findMany({
            where: {
                OR: [
                    { slug: userModulePermission.LIST },
                    { slug: userModulePermission.ADD },
                    { slug: userModulePermission.UPDATE },
                    { slug: categoryModulePermission.LIST },
                    { slug: categoryModulePermission.ADD },
                    { slug: categoryModulePermission.UPDATE },
                    { slug: categoryModulePermission.DELETE },
                    { slug: subCategoryModulePermission.LIST },
                    { slug: subCategoryModulePermission.ADD },
                    { slug: subCategoryModulePermission.UPDATE },
                    { slug: subCategoryModulePermission.DELETE },
                    { slug: bannerModulePermission.LIST },
                    { slug: bannerModulePermission.ADD },
                    { slug: bannerModulePermission.UPDATE },
                    { slug: bannerModulePermission.DELETE },
                    { slug: blogModulePermissions.LIST },
                    { slug: blogModulePermissions.ADD },
                    { slug: blogModulePermissions.UPDATE },
                    { slug: blogModulePermissions.DELETE },
                    { slug: productModulePermission.LIST },
                    { slug: productModulePermission.ADD },
                    { slug: productModulePermission.UPDATE },
                    { slug: productModulePermission.DELETE },
                    { slug: cartModulePermission.LIST },
                    { slug: cartModulePermission.ADD },
                    { slug: cartModulePermission.DELETE },
                    { slug: cartModulePermission.UPDATE },
                    { slug: orderModulePermission.CREATE },
                    { slug: orderModulePermission.LIST },
                    { slug: orderModulePermission.DELETE },
                ]
            }
        })
        const subAdminPermission = [];
        subadminnpermissions.forEach((permission: any, permissionIndex: number) => {
            subAdminPermission.push({
                role_id: subadminRole.id,
                permission_id: permission.id
            });
        });
        await prisma.role_permissions.createMany({ data: subAdminPermission });
        console.log("subadmin role-permission seeding end...!");

        // console.log('supplier role-permission seeding start');
        // await prisma.role_permissions.deleteMany({ where: { role_id: supplierRole.id } })
        // const supplierPermission=[];
        // const supplier_permissions = await prisma.permissions.findMany({
        //     where: {
        //         OR: [
        //             {slug:productModulePermission.LIST},
        //             {slug:productModulePermission.ADD},
        //             {slug:productModulePermission.UPDATE},
        //             {slug:productModulePermission.DELETE}
        //         ]
        //     }
        // })
        // supplier_permissions.forEach((permission: any, permissionIndex: number) => {
        //     supplierPermission.push({
        //         role_id: supplierRole.id,
        //         permission_id: permission.id
        //     });
        // });

        // await prisma.role_permissions.createMany({ data:supplierPermission });
        // console.log("supplier role-permission seeding end...!");

        //supplier user type permisssion seeding start....
        console.log("supplier user type permisssion seeding start....")
        await prisma.role_permissions.deleteMany({
            where: {
                AND: [
                    { role_id: userRole.id }, { userType: "SUPPLIER" }
                ]
            }
        })

        //seeding supplier permission
        const supplier_permission = await prisma.permissions.findMany({
            where: {
                OR: [
                    { slug: productModulePermission.LIST },
                    { slug: productModulePermission.ADD },
                    { slug: productModulePermission.UPDATE },
                    { slug: productModulePermission.DELETE }
                ]
            }
        })

        //
        const supplierPermission = [];
        supplier_permission.forEach((permission: any, permissionIndex: number) => {
            supplierPermission.push({
                role_id: userRole.id,
                permission_id: permission.id,
                userType: "SUPPLIER"
            });
        });
        await prisma.role_permissions.createMany({
            data: supplierPermission
        })

        console.log("supplier permission seeded successfully");

        //customer permission seeding order......
        console.log("customer permission seeding order......");
        await prisma.role_permissions.deleteMany({
            where: {
                AND: [{ role_id: userRole.id }, { userType: "CUSTOMER" }]
            }
        })

        const customer_permission = await prisma.permissions.findMany({
            where: {
                OR: [
                    { slug: cartModulePermission.LIST },
                    { slug: cartModulePermission.ADD },
                    { slug: cartModulePermission.UPDATE },
                    { slug: cartModulePermission.DELETE },
                    { slug: orderModulePermission.LIST },
                    { slug: orderModulePermission.CREATE },
                    { slug: orderModulePermission.DELETE },
                ]
            }
        })
        console.log(customer_permission);
        //
        const customerPermission = [];
        customer_permission.forEach((permission: any, permissionIndex: number) => {
            customerPermission.push({
                role_id: userRole.id,
                permission_id: permission.id,
                userType: "CUSTOMER"
            });
        });
        console.log(customer_permission);
        try {
            await prisma.role_permissions.createMany({
                data: customerPermission
            })
        } catch (error) {
            console.log(error);
        }

        console.log("customer permission seeded successfully");


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