import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule, PrismaModule, AuthModule, PracticeModule } from './module/index'
import { AwsModule } from './module/aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, PrismaModule, AuthModule, PracticeModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
