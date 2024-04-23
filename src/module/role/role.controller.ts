import { Body, Controller, Get, Res,Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Response } from 'express';

@Controller('role')
export class RoleController {

    constructor(private roleServive: RoleService) { }

    @Get("allroles")
    async getAllRoles(@Res() res:Response) {
        return await this.roleServive.getAllRoles(res);
    }

    @Post("/add")
    async addRole(@Body() data:any,@Res() res:Response){
          return await this.roleServive.addrole(res,data);
    }
}
