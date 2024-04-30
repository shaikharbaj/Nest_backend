import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { createBannerDTO } from './dto/createbannerDto';
import { Response } from 'express';
import { CloudinaryService } from 'src/cloudinary.service';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { updateBannerDTO } from './dto/updatebannerDto';

const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class BannerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService,
    ) { }

    public async extract_public(url: string) {
        const regex = /\/v\d+\/(\w+)\/\w+\.\w+$/;
        const match = url.match(regex);
        const publicID = match
            ? match[0].slice(1).split('.')[0].split('/').slice(1, 3).join('/')
            : null;
        return publicID;
    }

    async findManywithPagination(select: {}, where: any, page: number = 1) {
        return await paginate(
            this.prisma.banner,
            {
                select: select,
                where: { ...where },
            },
            { page },
        );
    }

    async addBanner(
        file: Express.Multer.File,
        data: createBannerDTO,
        response: Response,
        auth: any,
    ) {
        try {
            // save image to cloudinary.......
            const uploadedImage = await this.cloudinary.uploadImage(file);
            console.log(uploadedImage);
            //save banner...
            const savebanner = await this.prisma.banner.create({
                data: {
                    title: data.title,
                    description: data.description,
                    start_date: new Date(data.start_date),
                    end_date: new Date(data.end_date),
                    user_id: Number(auth.userId),
                    imageUrl: uploadedImage.url,
                },
            });

            return response
                .status(HttpStatus.OK)
                .json({
                    success: true,
                    message: 'banner created successfully',
                    data: savebanner,
                });
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }

    async getAllBannerswithpagination(page: number, searchTerm: string, response: Response) {
        try {
            const select = {
                id: true,
                title: true,
                imageUrl: true,
                description: true,
                start_date: true,
                end_date: true,
                user_id: true,
            };
            const where = {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    // { start_date: { contains: searchTerm, mode: 'insensitive' } },
                    // { end_date: { contains: searchTerm, mode: 'insensitive' } },
                ],
            };
            const data = await this.findManywithPagination(select, where, page);
            return response
                .status(HttpStatus.OK)
                .json({ success: true, message: 'banner fetch successfully', data });
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }
    async getallbanners(response: Response) {
        try {
            const currentdate = new Date().toISOString();
            console.log(currentdate);
            const allbanners = await this.prisma.banner.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    imageUrl: true,
                    start_date: true,
                    end_date: true
                },
                where: {
                    AND: [
                        { start_date: { lte: currentdate } }, // Start date is less than or equal to the current date
                        { end_date: { gte: currentdate } }   // End date is greater than or equal to the current date
                    ]
                }

            });
            console.log(allbanners);
            return response
                .status(HttpStatus.OK)
                .json({ success: true, message: 'banner fetch successfully', data: allbanners });
            //    / Return the banners instead of using response object
        } catch (error) {
            throw new Error(error.message); // Throw the error to handle it elsewhere
        }
    }

    async getbannerbyId(id: number, response: Response) {
        try {
            const banner = await this.prisma.banner.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!banner) {
                throw new Error('banner with this id not found..');
            }
            return response
                .status(HttpStatus.OK)
                .json({
                    success: true,
                    message: 'banner fetch successfully',
                    data: banner,
                });
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }

    async updatebanner(file: Express.Multer.File, data: updateBannerDTO, id: number, response: Response) {
        try {
            //check banner present or not
            const banner = await this.prisma.banner.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!banner) {
                throw new Error('banner with this id not found..');
            }
            const datapayload = {};
            if (data.title) {
                datapayload['title'] = data.title;
            }
            if (data.description) {
                datapayload['description'] = data.description;
            }
            if (data.start_date) {
                datapayload['start_date'] = new Date(data.start_date);
            }
            if (data.end_date) {
                datapayload['end_date'] = new Date(data.end_date);
            }
            if (file) {
                const publicID = await this.extract_public(banner.imageUrl);
                //delete previous image and upload new
                await this.cloudinary.removeImage(publicID).then((res) => {
                    console.log('image deleted successfully');
                });
                //upload new
                const newImage = await this.cloudinary.uploadImage(file);
                datapayload['imageUrl'] = newImage.url;
            }
            const updatedbanner = await this.prisma.banner.update({
                where: {
                    id: Number(id),
                },
                data: {
                    ...datapayload,
                },
            });
            return response
                .status(HttpStatus.OK)
                .json({
                    success: true,
                    message: 'banner updated successfully',
                    data: updatedbanner,
                });
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }

    async deletebanner(id: number, response: Response) {
        try {
            const banner = await this.prisma.banner.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!banner) {
                throw new Error('banner with this id not found..');
            }
            //delete banner
            const deletedbanner = await this.prisma.banner.delete({
                where: {
                    id: Number(id),
                },
            });
            //remove image form cloudinary..
            const publicId = await this.extract_public(deletedbanner.imageUrl);
            await this.cloudinary.removeImage(publicId).then((res) => {
                console.log(res);
            });
            return response
                .status(HttpStatus.OK)
                .json({
                    success: true,
                    message: 'banner deleted successfully',
                    data: deletedbanner,
                });
        } catch (error) {
            return response
                .status(HttpStatus.BAD_REQUEST)
                .json({ success: false, message: error.message });
        }
    }
}
