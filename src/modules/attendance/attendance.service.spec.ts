import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { userSchema } from '../user/Schemas/user.schema';
import { StudentService } from '../student/student.service';
import { Model, Types } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { Student, studentSchema } from '../student/Schemas/student.schema';
import {
  Department,
  departmentSchema,
} from '../department/Schemas/dept.schema';
import {
  Attendance,
  attendanceSchema,
} from '../attendance/Schemas/attendance.schema';
import { AttendanceService } from '../attendance/attendance.service';
import { depOne, depTwo } from '../../../testStubs/testing.stubs';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';

describe('StudentService', () => {
  let track: object;
  let studentModel: Model<Student>;
  let attendanceService: AttendanceService;
  let studentService: StudentService;
  let depService: DepartmentService;
  let depModel: Model<Department>;
  let attendanceModel: Model<Attendance>;
  let department: Department;
  let student: Student;
  let stId1: string;
  let stId2: string;
  let depId1: Types.ObjectId;
  let depId2: string;
  let atId1: string;
  let atId2: string;
  // let attendance: CreateAttendanceDto;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.TEST_MONGODB_URL, {
          dbName: process.env.TEST_MONGODB_DB_NAME,
        }),
        MongooseModule.forFeature([{ name: 'Student', schema: studentSchema }]),
        MongooseModule.forFeature([
          {
            name: 'Department',
            schema: departmentSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: 'Attendance',
            schema: attendanceSchema,
          },
        ]),
      ],
      providers: [StudentService, DepartmentService, AttendanceService],
    }).compile();
    depService = module.get<DepartmentService>(DepartmentService);
    attendanceService = module.get<AttendanceService>(AttendanceService);
    studentService = module.get<StudentService>(StudentService); // Add this line
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
    depModel = module.get<Model<Department>>(getModelToken(Department.name));
    attendanceModel = module.get<Model<Attendance>>(
      getModelToken(Attendance.name),
    );
    await studentService.clearStudents();
    await depService.clearDepartment();
    await attendanceService.clearAttendance();
    const { id } = await depService.create(depOne);
    depId1 = id;
    const { id: newId } = await depService.create(depTwo);
    depId2 = newId;
  });

  it('should be defined attendance service', () => {
    expect(attendanceService).toBeDefined();
  });

  describe('create student', () => {
    it('should be add student', async () => {
      const student1: CreateStudentDto = {
        name: 'temp',
        email: 'temp@gmail.com',
        mobileNumber: 123456789,
        password: '123',
        department: depId1,
        sem: 5,
        role: 'STUDENT',
        authToken: 'dummy',
      };
      const res = await studentService.create(student1);
      stId1 = res.id;
      expect(res).toBeDefined();
      expect(res).not.toBeNull();
    });
  });

  //only test purpose for testing department and student
  // describe('student login', () => {
  //   it('should be login student ', async () => {
  //     const st1 = await studentService.login('temp@gmail.com', '123');
  //     expect(st1).not.toBeNull();
  //     studentService.setStudentObj({ id: st1._id, role: 'STUDENT' });
  //   });
  // });

  // describe('change student details by admin', () => {
  //   it('should be able to change student details', async () => {
  //     console.log(studentService.getStudentObj()['id']);
  //     const student = await studentService.findOne(studentService.getStudentObj()['id']);
  //     console.log('student old department is  ', student.department);
  //     console.log('student new department is ', depId2);
  //     const res = await studentService.update(studentService.getStudentObj()['id'], {
  //       department: depId2,
  //       name: 'new test name',
  //     });
  //     expect(res).not.toBeNull();
  //   });
  // });

  describe('add attendance', () => {
    it('should be add new attendance', async () => {
      const at1: CreateAttendanceDto = {
        studentId: new Types.ObjectId(stId1),
        date: '12-11-2023',
        isPresent: true,
      };
      const res = await attendanceService.create(at1);
      expect(res).not.toBeNull();
    });
  });

  describe('add attendance', () => {
    it('should be add new attendance', async () => {
      const at1: CreateAttendanceDto = {
        studentId: new Types.ObjectId(stId1),
        date: '13-11-2023',
        isPresent: false,
      };
      const res = await attendanceService.create(at1);
      expect(res).not.toBeNull();
    });
  });

  describe('add attendance', () => {
    it('should be add new attendance', async () => {
      const at1: CreateAttendanceDto = {
        studentId: new Types.ObjectId(stId1),
        date: '14-11-2023',
        isPresent: true,
      };
      const res = await attendanceService.create(at1);
      atId1 = res.id;
      expect(res).not.toBeNull();
    });
  });

  describe('get attendance by student id', () => {
    it('should return all attendances', async () => {
      const res = await attendanceService.studentAttendance(stId1);
      console.log('get attendanceby student id', res);
      expect(res).not.toBeNull();
    });
  });

  describe('get one attendance by attendanceId', () => {
    it('should return attendance', async () => {
      const res = await attendanceService.getOneAttendance(atId1);
      console.log('atId1 is ', atId1);
      expect(res).not.toBeNull();
    });
  });

  describe('delete attendance by student id', () => {
    it('should delete attendance by student id', async () => {
      const res = await attendanceService.deleteManyAttendance(stId1);
      console.log('delete attendance is ', res);
      expect(res).not.toBeNull();
    });
  });
});
