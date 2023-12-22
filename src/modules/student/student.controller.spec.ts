import { Model } from 'mongoose';
import { Student, studentSchema } from './Schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserController } from '../user/user.controller';
import { attendanceSchema } from '../attendance/Schemas/attendance.schema';
import { departmentSchema } from '../department/Schemas/dept.schema';

describe('StudentController', () => {
  let studentModel: Model<Student>;
  let controller: StudentController;
  let service: StudentService;
  let student: Student;
  beforeAll(async () => {
    process.env.NEST_ENV = 'test';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.TEST_MONGODB_URL, {
          dbName: process.env.TEST_MONGODB_DB_NAME,
        }),
        MongooseModule.forFeature([
          { name: 'Student', schema: studentSchema },
          { name: 'Attendance', schema: attendanceSchema },
          { name: 'Department', schema: departmentSchema },
        ]),
      ],
      providers: [StudentService],
      controllers: [StudentController],
    }).compile();
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
    controller = module.get<StudentController>(StudentController);
  });
});
