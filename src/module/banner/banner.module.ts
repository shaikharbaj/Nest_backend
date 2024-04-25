import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService,CloudinaryService]
})
export class BannerModule {}
