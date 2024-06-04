import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';

@Injectable()
export class AttributevalueService {
  constructor(private readonly prisma: PrismaService) {}

  
}
