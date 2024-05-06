import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService,CloudinaryService]
})
export class BlogModule {}
