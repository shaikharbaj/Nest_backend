import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
@Injectable()
export class RoleService {

    constructor(private readonly prisma: PrismaService) { }
    async getAllRoles(res: Response) {
        try {
            const roles = await this.prisma.roles.findMany({
                select: {
                    id: true,
                    name: true
                }
            });
            return res.status(HttpStatus.OK).json({ success: true, roles })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message })
        }
    }
}
