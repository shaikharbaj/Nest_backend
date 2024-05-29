import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Auth } from '../user/dto/authdto';
import { Response } from 'express';
import { CartService } from './cart.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasPermission } from '../auth/decorator/has-permission.decorator';
import { cartModulePermission } from 'src/constants/permissions';

@Controller('cart')
export class CartController {
  constructor(private readonly cartservice: CartService) {}

  @UseGuards(JwtGuard)
  @Get('/all')
  async loadCartProduct(@Auth() auth: any, @Res() res: Response) {
    return await this.cartservice.loadcartproduct(auth, res);
  }
  @HasPermission(cartModulePermission.ADD)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/add_to_cart')
  async AddToCart(@Auth() auth: any, @Body() data: any, @Res() res: Response) {
    return await this.cartservice.add_to_cart(auth, data, res);
  }

  @HasPermission(cartModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/increment_quantity/:id')
  async incrementCartProductQuantity(
    @Auth() auth: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.cartservice.incrementQuantity(auth, id, res);
  }
  @HasPermission(cartModulePermission.UPDATE)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('/decrement_quantity/:id')
  async decrementCartProductQuantity(
    @Auth() auth: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.cartservice.decrementQuantity(auth, id, res);
  }
  @HasPermission(cartModulePermission.DELETE)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/removeproduct/:id')
  async removeproductfromcart(
    @Auth() auth: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    return await this.cartservice.removeproductfromcart(auth, id, res);
  }

  @UseGuards(JwtGuard)
  @Get('/cartcount')
  async getcartcount(@Auth() auth: any, @Res() res: Response) {
    return await this.cartservice.getcartcount(auth, res);
  }
}
