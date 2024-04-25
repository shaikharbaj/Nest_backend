import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule, PrismaModule, AuthModule, PracticeModule, EmailModule, RoleModule } from './module/index'
import { AwsModule } from './module/aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BannerModule } from './module/banner/banner.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventEmitterModule.forRoot(), UserModule, PrismaModule, AuthModule, PracticeModule, EmailModule, RoleModule, BannerModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
