import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';

@Injectable()
export class PracticeService {
    constructor(private prisma: PrismaService) {}


    //add data......
    async addData(){
           try {
            
           } catch (error) {
            
           }
    }
}
