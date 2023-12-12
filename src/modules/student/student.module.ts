import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, studentSchema } from './Schemas/student.schema';
import { RolesGuard } from '../../guards/roles.guard';
import { DepartmentModule } from '../department/department.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: studentSchema,
      },
    ]),
    forwardRef(() => DepartmentModule),
    forwardRef(() => AttendanceModule),
  ],
  controllers: [StudentController],
  providers: [StudentService, RolesGuard],
  exports: [StudentService],
})
export class StudentModule {}
