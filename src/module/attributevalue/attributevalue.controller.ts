import { Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AttributevalueService } from './attributevalue.service';
import { Response } from 'express';
@Controller('attributevalue')
export class AttributevalueController {
  constructor(private readonly attriburevalueService: AttributevalueService) {}

  

  @Post('/add')
  async addAttributevalue() {}
}
