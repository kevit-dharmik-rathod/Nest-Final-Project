import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ExceptionFilterModule } from './exceptionFilter/exception-filter.module';
import { DepartmentModule } from './modules/department/department.module';
import { StudentModule } from './modules/student/student.module';
import { UserAuthenticationMiddleware } from './middlewares/user-authentication.middleware';
import { UserController } from './modules/user/user.controller';
import { DepartmentController } from './modules/department/department.controller';
import { StudentController } from './modules/student/student.controller';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AttendanceController } from './modules/attendance/attendance.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
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
    }),
    ExceptionFilterModule,
    UserModule,
    DepartmentModule,
    StudentModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthenticationMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.POST },
        { path: '/student/login', method: RequestMethod.POST },
      )
      .forRoutes(
        UserController,
        DepartmentController,
        StudentController,
        AttendanceController,
      );
  }
}
