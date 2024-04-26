import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { createBannerDTO } from './dto/createbannerDto';
import { Auth } from '../user/dto/authdto';
import { JwtGuard } from '../user/guards/jwt.guards';
import { updateBannerDTO } from './dto/updatebannerDto';

@Controller('banner')
export class BannerController {
    constructor(readonly bannerServive: BannerService) { }
    @Get()
    async getallbannerwithpagination(@Query() payload: any,@Res() response: Response) {
        const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    // return await this.userservice.getallusers(Number(page), searchTerm);
        return await this.bannerServive.getAllBannerswithpagination(Number(page),searchTerm,response)
    }
    @Get("/all")
    async getallbanners(@Res() response:Response){
           return await this.bannerServive.getallbanners(response);
    }
    @Get(":id")
    async getbannerById(@Param("id") id: number, @Res() response: Response) {
        return await this.bannerServive.getbannerbyId(id, response);
    }


    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('banner'))
    @Post("/add")
    async addbanner(@Body() data: createBannerDTO, @UploadedFile(FileValidationPipe) file: Express.Multer.File, @Res() response: Response, @Auth() auth: any) {
        if (!file) {
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "banner image is required" })
        }
        return await this.bannerServive.addBanner(file, data, response, auth)
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('banner'))
    @Patch("/edit/:id")
    async editbanner(@Param("id") id: number, @Body() data: updateBannerDTO, @UploadedFile(FileValidationPipe) file: Express.Multer.File, @Res() response: Response) {
        return await this.bannerServive.updatebanner(file, data, id, response);
    }

    @Delete("delete/:id")
    async deletebanner(@Param("id") id: number, @Res() response: Response) {
        return await this.bannerServive.deletebanner(id, response);
    }

}
