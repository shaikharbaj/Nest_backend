import { Body, Controller, Post, Res } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { supplierloginDTO } from "./dto/supplierloginDTO";
import { Response } from "express";
import { createsupplierDTO } from "./dto/createsupplier.dto";

@Controller("supplier")
export class SupplierController{
    constructor(private readonly supplierservice:SupplierService){}

    @Post("/register")
    async register(@Body() data:createsupplierDTO,@Res() res:Response){
       return await this.supplierservice.register(data,res);
    }
    @Post("/login")
    async login(@Body() data:supplierloginDTO,@Res() res:Response){
          return await this.supplierservice.login(data,res);
    }

}