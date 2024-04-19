import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './decorator/roles.decorator';
import { Role } from 'src/constants/role';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
@Controller('auth')
export class AuthController {

       constructor(private reflector: Reflector) { }

       @Roles(Role.ADMIN)
       @UseGuards(JwtGuard, RolesGuard)
       @Get()
       async practice() {
              return "hiii";
       }
}
