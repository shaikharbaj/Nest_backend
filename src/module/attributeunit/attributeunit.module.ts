import { Module } from '@nestjs/common';
import { AttributeunitController } from './attributeunit.controller';
import { AttributeunitService } from './attributeunit.service';

@Module({
  controllers: [AttributeunitController],
  providers: [AttributeunitService]
})
export class AttributeunitModule {}
