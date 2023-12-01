import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

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
  ]),StudentModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
