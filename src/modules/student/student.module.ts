import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, studentSchema } from './Schemas/student.schema';
import { RolesGuard } from '../../guards/roles.guard';
import { StudentAuthenticationMiddleware } from '../../middlewares/student-authentication.middleware';
import { DepartmentModule } from '../department/department.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Student.name,
      useFactory: () => {
        const schema = studentSchema;
        schema.pre('save', () => { });
        return schema;
      },
    },
  ]), forwardRef(() => UserModule), forwardRef(() => DepartmentModule)],
  controllers: [StudentController],
  providers: [StudentService, RolesGuard],
  exports: [StudentService]
})
export class StudentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StudentAuthenticationMiddleware).exclude(
      { path: '/student/login', method: RequestMethod.POST }, // Adjust the path accordingly
    ).forRoutes(StudentController);
  }
}