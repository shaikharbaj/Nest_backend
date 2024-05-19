import { Injectable, UnauthorizedException } from "@nestjs/common";
import { supplierloginDTO } from "./dto/supplierloginDTO";
import { Response } from "express";
import * as bcrypt from'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from "../prisma/prismaservice";
import { createsupplierDTO } from "./dto/createsupplier.dto";
@Injectable()
export class SupplierService{
    constructor(private readonly prisma:PrismaService){}

      public async extractPublicId(url: string) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const publicId = filename.split('.')[0];
        return publicId;
      }
    
      public async generateToken(payload: any, options: any) {
        return await jwt.sign(payload, 'ARBAJ', options);
      }
    
    //   public async validatesupplier(data: supplierloginDTO) {
    //     //check user is exist or not
    //     const supplier = await this.findByEmail(data.email);
    //     console.log(supplier)
    //     //if user is not found
    //     if (!supplier) {
    //       throw new UnauthorizedException('Invalid credintials');
    //     }
    
    //     if (!supplier.status) {
    //       throw new Error("your accound is currently suspended please contact to admin")
    //     }
    
    //     //comopair
    //     const checkpassword = await bcrypt.compare(data.password, supplier.password);
    
    //     if (!checkpassword) {
    //       throw new UnauthorizedException('Invalid credintials');
    //     }
    
    //     const { password, ...result } = supplier;
    
    //     return result;
    //   }
    // public async findByEmail(email: string) {
    //     const checkuserRole = await this.prisma.roles.findFirst({
    //       where: {
    //         name: 'SUPPLIER',
    //       },
    //     });
    //     // return await this.prisma.supplier.findUnique({
    //     //   select: {
    //     //     id: true,
    //     //     name: true,
    //     //     avatar: true,
    //     //     email: true,
    //     //     password: true,
    //     //     status: true,
    //     //     user_information: {
    //     //       select: {
    //     //         data_of_birth: true,
    //     //         phone_number: true,
    //     //         state: true,
    //     //         street: true,
    //     //         city: true,
    //     //         zipcode: true,
    //     //       },
    //     //     },
    //     //     role_id: true,
    //     //     role: {
    //     //       select: {
    //     //         id: true,
    //     //         name: true,
    //     //         permissions: true
    //     //       },
    //     //     },
    
    //     //   },
    //     //   where: { email, role_id: Number(checkuserRole.id) },
    //     // });
    //   }
    public async hashedpassword(password:string){
        return await bcrypt.hash(password,10);
 }
 public async getsupplierrole(){
        return await this.prisma.roles.findFirst({where:{name:"SUPPLIER"}})
 }
 public async checksupplierexist(email:string){
         return this.prisma.supplier.findUnique({
            select:{
                id:true,
                name:true,
                email:true,
                password:true,
                avatar:true,
                address:true,
                role_id:true,
                status:true,
                role: {
                    select: {
                      id: true,
                      name: true,
                      permissions: {
                        select: {
                          permission_id: true,
                          permission: true
                        }
                      }
                    },
                  },
            },
            where:{
                email:email
            }
     })
 }
    async login(payload:supplierloginDTO,res:Response){
          try {
              //check email exist.....
              const checksupplierexist = await this.checksupplierexist(payload.email)
              if(!checksupplierexist){
                   throw new Error('Invalid creadintials');
              }
              if(!checksupplierexist.status){
                   throw new Error('Your accound is temporarily suspended contact to admin');
              }
              //check password....
              const ispasswordvalid = await bcrypt.compare(payload.password,checksupplierexist.password);
              if(!ispasswordvalid){
                throw new Error('Incorrect password');
              }
            
              //generate token..........
              const pay ={
                userId: checksupplierexist.id,
                email: checksupplierexist.email,
                name: checksupplierexist.name,
                roles: [checksupplierexist.role.name],
                avatar: checksupplierexist.avatar,
                // user_information: user.user_information,
                permissions: checksupplierexist?.role?.permissions.map((p: any) => p?.permission?.slug)   
              }
              const data={
                   name:checksupplierexist.name,
                   email:checksupplierexist.email,
                   avatar:checksupplierexist.avatar
              }
              

              const options:{expiresIn:string}= { expiresIn: '10h' }
              const token = await this.generateToken(pay,options);

              return res.status(201).json({success:true,message:"supplier loggedIn successfully",token,data});
          } catch (error) {
            return res.status(401).json({success:false,message:error.message});
          }
    }

   

    async register(payload:createsupplierDTO,res:Response){
           try {
                //check email already exist....
                const checkalreadyexist = await this.checksupplierexist(payload.email)
                if(checkalreadyexist){
                       throw new Error("supplier with this email already exist");
                }

                //hashed password....
                const hashedpassword = await this.hashedpassword(payload.password);

                //supplier role id
                const supplierRole = await this.getsupplierrole();
                //register supplier....
                const supplier = await this.prisma.supplier.create({
                       select:{
                           name:true,
                           email:true,
                           avatar:true,
                           address:true
                       },
                        data:{
                               name:payload.name,
                               email:payload.email,
                               password:hashedpassword,
                               role_id:supplierRole.id
                        }
                })
                return res.status(201).json({success:true,message:"supplier registerd successfully",data:supplier});
           } catch (error) {
            return res.status(401).json({success:false,message:error.message});
           }
    }
}