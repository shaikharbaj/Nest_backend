import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Auth } from '../user/dto/authdto';
import { JwtGuard } from '../user/guards/jwt.guards';

@Controller('order')
export class OrderController {
    constructor(private readonly orderservice : OrderService){}

    @UseGuards(JwtGuard)
    @Post("/orderproduct")
    async OrderProduct(@Auth() auth:any,@Body() data:any,@Res() res:Response){
          return await this.orderservice.orderproduct(auth,data,res);
    }

    @UseGuards(JwtGuard)
    @Get("/getallorderofcustomer")
    async getallorderofcustomer(@Auth() auth:any,@Res() res:Response){
            return await this.orderservice.getallordersofcustomer(auth,res)
    }
}
