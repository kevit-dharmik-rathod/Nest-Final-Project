import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService]
})
export class DepartmentModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).exclude(
      { path: '/user/login', method: RequestMethod.POST },
    ).forRoutes(DepartmentController);
  }
}
