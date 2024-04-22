import { Controller, Get, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { Response } from 'express';

@Controller('role')
export class RoleController {

    constructor(private roleServive: RoleService) { }

    @Get("allroles")
    async getAllRoles(@Res() res:Response) {
        return await this.roleServive.getAllRoles(res);
    }
}
