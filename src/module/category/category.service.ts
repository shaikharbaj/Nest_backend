import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prismaservice';

@Injectable()
export class CategoryService {

    constructor(private readonly prisma: PrismaService) { }

    async addCategory(payload: any, res: Response) {
        try {
            //check it is already present...
            const iscategoryAlreadyPresent = await this.prisma.category.findFirst({
                where: {
                    name: payload.name
                }
            })
            if (iscategoryAlreadyPresent) {
                throw new Error("this category is alredy exist...");
            }
            const data = await this.prisma.category.create({
                data: {
                    name: payload.name
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "cataegory created successfully.!", data });
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async addsubCategory(payload: any, res: Response) {
        try {
            //check already exist or not
            const checksubalreadyexist = await this.prisma.category.findFirst({
                where: {
                    AND: [
                        {
                            parent_id: Number(payload.parent_id)
                        }, {
                            name: payload.name
                        }
                    ]
                }
            })
            if (checksubalreadyexist) {
                throw new Error("this subcategory is alredy exist in this category...");
            }
            const data = await this.prisma.category.create({
                data: {
                    name: payload.name,
                    parent_id: Number(payload.parent_id)
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "subcategory created successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async getAllCategories(res: Response) {
        try {
            const data = await this.prisma.category.findMany({
                where: {
                    parent_id: null
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "all cataegory fetch successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async getallsubcategories(res: Response) {
        try {
            const data = await this.prisma.category.findMany({
                where: {
                    NOT: {
                        parent_id: null
                    }
                },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }

            });
            // console.log()

            return res.status(HttpStatus.OK).json({ success: true, message: "all sub-cataegory fetch successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async getcategorybyId(id: number, res: Response) {
        try {
            const data = await this.prisma.category.findFirst({
                where: {
                    id: Number(id)
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "cataegory fetch successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async getsubcategorysubcategory(id: number, res: Response) {
        try {
            const data = await this.prisma.category.findFirst({
                select: {
                    id: true,
                    name: true,
                    parent_id: true
                },
                where: {
                    id: Number(id)
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "subcategory fetch successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async sub_of_single_category(id: number, res: Response) {
      
        try {
            const checkcategoriesexist = await this.prisma.category.findFirst({
                where: {
                    id: Number(id),
                    parent_id: null
                }
            })
            if (!checkcategoriesexist) {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "category not found with this id" });
            }
            const data = await this.prisma.category.findMany({
                where: {
                    parent_id: Number(id)
                },
                include: {
                    parent: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "subcategory fetch successfully.!", data });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
    async editcategory(payload: any, id: number, res: Response) {
        try {

            //check category already present or not
            const checkexist = await this.prisma.category.findFirst({ where: { id: Number(id), parent_id: null } })
            if (!checkexist) {
                throw new Error("category with this is not found");
            }
            const data = await this.prisma.category.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: payload.name
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "cataegory updated successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    async updatesubCategory(payload: any, id: number, res: Response) {
        try {
            //check already exist or not
            const checksubalreadyexist = await this.prisma.category.findFirst({
                where:
                {
                    id: Number(id)
                }
            })
            if (!checksubalreadyexist) {
                throw new Error("subcategory is not exist..!");
            }
            const data = await this.prisma.category.update({
                where: {
                    id: Number(id)
                }, data: {
                    name: payload.name,
                    parent_id: payload.parent_id
                }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "subcategory updated successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    async deleteCategory(id: number, res: Response) {
        try {

            //check category already present or not..
            const checkexist = await this.prisma.category.findFirst({ where: { id: Number(id), parent_id: null } })
            if (!checkexist) {
                throw new Error("category with this is not found");
            }
            const data = await this.prisma.category.delete({
                where: {
                    id: Number(id)
                }

            })
            if (checkexist.parent_id === 0) {
                const deleteIDS = await this.prisma.category.findMany({
                    select: { id: true },
                    where: {
                        parent_id: data.id
                    }
                })
                const ids = deleteIDS.map((ele) => ele.id);
                if (ids.length > 0) {
                    //delete...
                    await this.prisma.category.deleteMany({
                        where: {
                            id: {
                                in: ids
                            }
                        }
                    })
                }
            }
            return res.status(HttpStatus.OK).json({ success: true, message: "cataegory deleted successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    async deletesubCategory(id: number, res: Response) {
        try {
            //check subcategory already present or not..
            const checkexist = await this.prisma.category.findFirst({ where: { id: Number(id) } })
            if (!checkexist) {
                throw new Error("sub-category with this is not found");
            }
            const data = await this.prisma.category.delete({
                where: {
                    id: Number(id)
                }

            })
            return res.status(HttpStatus.OK).json({ success: true, message: "subcategory deleted successfully.!", data });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    async getcategoryforFilter(res:Response){
        try {
            const data = await this.prisma.category.findMany({
                   where:{
                        parent_id:null
                   },
                   include:{
                      Category:true
                   }
            })
            return res.status(HttpStatus.OK).json({ success: true, message: "allcategories successfully.!", data });
        } catch (error) {
            console.log(error)
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }
}
