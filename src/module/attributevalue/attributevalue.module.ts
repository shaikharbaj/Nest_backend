import { Module } from '@nestjs/common';
import { AttributevalueController } from './attributevalue.controller';
import { AttributevalueService } from './attributevalue.service';

@Module({
  controllers: [AttributevalueController],
  providers: [AttributevalueService]
})
export class AttributevalueModule {}
