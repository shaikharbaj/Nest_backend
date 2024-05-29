import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';
import { Auth } from '../user/dto/authdto';
import { JwtGuard } from '../user/guards/jwt.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import { orderModulePermission } from 'src/constants/permissions';

@Controller('order')
export class OrderController {
  constructor(private readonly orderservice: OrderService) {}

  @HasPermission(orderModulePermission.CREATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/orderproduct')
  async OrderProduct(
    @Auth() auth: any,
    @Body() data: any,
    @Res() res: Response,
  ) {
    return await this.orderservice.orderproduct(auth, data, res);
  }

  @UseGuards(JwtGuard)
  @Get('/getallorderofcustomer')
  async getallorderofcustomer(@Auth() auth: any, @Res() res: Response) {
    return await this.orderservice.getallordersofcustomer(auth, res);
  }
  @UseGuards(JwtGuard)
  @Get('/getorderbyid/:id')
  async getOrderById(
    @Auth() auth: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.orderservice.getorderbyID(auth, id, res);
  }
  @UseGuards(JwtGuard)
  @Get('/loadallsupplierorders')
  async loadallsupplierorders(@Auth() auth: any, @Res() res: Response) {
    return await this.orderservice.loadallsupplierorders(auth, res);
  }

  @UseGuards(JwtGuard)
  @Get('/loadsinglesupplierorder/:id')
  async loadsinglesupplierOrder(
    @Auth() auth: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.orderservice.loadsinglesupplierOrder(auth, id, res);
  }

  @UseGuards(JwtGuard)
  @Patch('/updateorderstatus')
  async updateorderstatus(
    @Auth() auth: any,
    @Body() data: any,
    @Res() res: Response,
  ) {
    return await this.orderservice.updateorderstatus(auth, data, res);
  }
}
