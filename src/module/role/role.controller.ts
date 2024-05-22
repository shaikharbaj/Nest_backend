import { Body, Controller, Get, Res, Post, Param, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { Response } from 'express';

@Controller('role')
export class RoleController {

    constructor(private roleService: RoleService) { }

    @Get("allroles")
    async getAllRoles(@Res() res: Response) {
        return await this.roleService.getAllRoles(res);
    }

    @Post("/add")
    async addRole(@Body() data: any, @Res() res: Response) {
        return await this.roleService.addrole(res, data);
    }

    @Get("/get_role_permission")
    async get_role_permission(@Query() data: any, @Res() res: Response) {
          return await this.roleService.get_role_permission(Number(data.role),data.userType,res)
    }
}
