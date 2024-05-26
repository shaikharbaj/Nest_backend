import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../user/guards/jwt.guards';
import { Auth } from '../user/dto/authdto';
import { Response } from 'express';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {

     constructor(private readonly cartservice:CartService){}

    @UseGuards(JwtGuard)
    @Get("/all")
    async loadCartProduct(@Auth() auth:any,@Res() res:Response){
           return await this.cartservice.loadcartproduct(auth,res);
    }
    @UseGuards(JwtGuard)
    @Post("/add_to_cart")
    async AddToCart(@Auth() auth:any,@Body() data:any,@Res() res:Response){
           return await this.cartservice.add_to_cart(auth,data,res);
    }
    @UseGuards(JwtGuard)
    @Patch("/increment_quantity/:id")
    async incrementCartProductQuantity(@Auth() auth:any,@Param("id") id:number,@Res() res:Response){
           return await this.cartservice.incrementQuantity(auth,id,res);
    }
    @UseGuards(JwtGuard)
    @Patch("/decrement_quantity/:id")
    async decrementCartProductQuantity(@Auth() auth:any,@Param("id") id:number,@Res() res:Response){
           return await this.cartservice.decrementQuantity(auth,id,res);
    }
    @UseGuards(JwtGuard)
    @Delete("/removeproduct/:id")
    async removeproductfromcart(@Auth() auth:any,@Param("id") id:number,@Res() res:Response){
           return await this.cartservice.removeproductfromcart(auth,id,res);
    }

    @UseGuards(JwtGuard)
    @Get("/cartcount")
    async getcartcount(@Auth() auth:any,@Res() res:Response){
          return await this.cartservice.getcartcount(auth,res);
    }


}
