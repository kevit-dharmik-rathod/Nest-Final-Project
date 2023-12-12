import {  Module,  forwardRef } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, departmentSchema } from './Schemas/dept.schema';
import { RolesGuard } from '../../guards/roles.guard';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Department.name,
      schema: departmentSchema
    },
  ]),forwardRef(()=> StudentModule)],
  controllers: [DepartmentController],
  providers: [DepartmentService, RolesGuard],
  exports: [DepartmentService]
})
export class DepartmentModule { }
