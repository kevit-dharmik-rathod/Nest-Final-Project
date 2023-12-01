import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, departmentSchema } from './Schemas/dept.schema';
import { RolesGuard } from '../user/guards/roles.guard';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Department.name,
      useFactory: () => {
        const schema = departmentSchema;
        schema.pre('save', () => {});
        return schema;
      },
    },
  ]),UserModule],
  controllers: [DepartmentController],
  providers: [DepartmentService,RolesGuard],
  exports: [DepartmentService]
})
export class DepartmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).exclude(
      { path: '/department/login', method: RequestMethod.POST }, // Adjust the path accordingly
    ).forRoutes(DepartmentController);
  }
}
