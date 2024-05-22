import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule, PrismaModule, AuthModule, PracticeModule, EmailModule, RoleModule, CategoryModule, BlogModule, BannerModule, SupplierModule, ProductModule, CartModule } from './module/index'
import { AwsModule } from './module/aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { EventEmitterModule } from '@nestjs/event-emitter';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventEmitterModule.forRoot(), UserModule, PrismaModule, AuthModule, PracticeModule, EmailModule, RoleModule, BannerModule, CategoryModule, BlogModule, SupplierModule, ProductModule, CartModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
