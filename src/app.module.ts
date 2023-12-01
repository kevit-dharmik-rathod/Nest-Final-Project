import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from  './modules/user/user.module';
import { ExceptionFilterModule } from './exceptionFilter/exception-filter.module';
import { DepartmentModule } from './modules/department/department.module';
import { StudentModule } from './modules/student/student.module';
@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URL'),
        };
      },
      inject: [ConfigService],
    }),ExceptionFilterModule,UserModule, DepartmentModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
