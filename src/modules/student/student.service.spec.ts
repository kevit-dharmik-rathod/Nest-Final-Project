import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { AttendanceService } from '../attendance/attendance.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentOtherFields } from './dto/update-student-fields.dto';
import { Types } from 'mongoose';

describe('StudentService', () => {
  let service: StudentService;
  let studentModel: Model<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        DepartmentService,
        AttendanceService,
        {
          provide: getModelToken(Student.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findByIdAndDelete: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentModel = module.get<Model<any>>(getModelToken(Student.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test case for showMyProfile method
  it('should return student profile', async () => {
    const studentId = new Types.ObjectId();
    service.setStudentObj({ id: studentId });

    const mockStudent = {
      _id: studentId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: new Types.ObjectId(),
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    jest.spyOn(studentModel, 'findById').mockResolvedValueOnce(mockStudent);
    jest
      .spyOn(service, 'showMyProfile')
      .mockImplementationOnce(() => service.showMyProfile());

    const result = await service.testShowMyProfile();

    expect(result).toEqual(mockStudent);
  });

  // Test case for updateMyPassword method
  it('should update student password successfully', async () => {
    const studentId = new Types.ObjectId();
    service.setStudentObj({ id: studentId });

    const mockStudent = {
      _id: studentId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: new Types.ObjectId(),
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    const newPassword = 'newSecurePassword456';

    jest.spyOn(studentModel, 'findById').mockResolvedValueOnce(mockStudent);
    jest
      .spyOn(service, 'updateMyPassword')
      .mockImplementationOnce(() =>
        service.updateMyPassword({ password: newPassword }),
      );

    const result = await service.testUpdateMyPassword();

    expect(result).toEqual('Password updated successfully');
  });

  // Test case for findOne method
  it('should find a student by ID', async () => {
    const studentId = new Types.ObjectId();
    const mockStudent = {
      _id: studentId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: new Types.ObjectId(),
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    jest.spyOn(studentModel, 'findById').mockResolvedValueOnce(mockStudent);
    jest
      .spyOn(service, 'findOne')
      .mockImplementationOnce(() => service.findOne(studentId.toString()));

    const result = await service.testFindOne();

    expect(result).toEqual(mockStudent);
  });

  // Test case for update method
  it('should update student information successfully', async () => {
    const studentId = new Types.ObjectId();
    const updateFields: UpdateStudentOtherFields = {
      name: 'Updated John Doe',
      email: 'updated.john.doe@example.com',
      mobileNumber: 9876543210,
      department: new Types.ObjectId(),
      sem: '2',
    };

    const mockStudent = {
      _id: studentId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: new Types.ObjectId(),
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    const mockExistingDepartment = {
      _id: mockStudent.department,
      occupiedSeats: 5,
      availableSeats: 10,
    };

    const mockNewDepartment = {
      _id: updateFields.department,
      occupiedSeats: 3,
      availableSeats: 10,
    };

    jest.spyOn(studentModel, 'findById').mockResolvedValueOnce(mockStudent);
    jest
      .spyOn(service.deptService, 'findOne')
      .mockResolvedValueOnce(mockExistingDepartment)
      .mockResolvedValueOnce(mockNewDepartment);

    jest
      .spyOn(service.deptService, 'update')
      .mockResolvedValueOnce(mockExistingDepartment);
    jest
      .spyOn(service.deptService, 'update')
      .mockResolvedValueOnce(mockNewDepartment);

    jest.spyOn(studentModel, 'save').mockResolvedValueOnce(mockStudent);

    jest
      .spyOn(service, 'update')
      .mockImplementationOnce(() =>
        service.update(studentId.toString(), updateFields),
      );

    const result = await service.testUpdate();

    expect(result).toEqual('department updated successfully');
  });

  // Test case for remove method
  it('should delete a student successfully', async () => {
    const studentId = new Types.ObjectId();
    const mockStudent = {
      _id: studentId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: new Types.ObjectId(),
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    const mockDepartment = {
      _id: mockStudent.department,
      occupiedSeats: 5,
      availableSeats: 10,
    };

    jest.spyOn(studentModel, 'findById').mockResolvedValueOnce(mockStudent);
    jest
      .spyOn(service.deptService, 'findOne')
      .mockResolvedValueOnce(mockDepartment);

    jest
      .spyOn(service.attendanceService, 'deleteManyAttendance')
      .mockResolvedValueOnce(undefined);
    jest
      .spyOn(studentModel, 'findByIdAndDelete')
      .mockResolvedValueOnce(undefined);

    jest
      .spyOn(service, 'remove')
      .mockImplementationOnce(() => service.remove(studentId.toString()));

    const result = await service.testRemove();

    expect(result).toEqual('student deleted successfully');
  });

  // Test case for deleteStudents method
  it('should delete all students in a department successfully', async () => {
    const departmentId = new Types.ObjectId();
    const mockStudent1 = {
      _id: new Types.ObjectId(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      mobileNumber: 1234567890,
      password: 'someSalt.someHash',
      department: departmentId,
      sem: '1',
      authToken: 'sampleAuthToken',
    };

    const mockStudent2 = {
      _id: new Types.ObjectId(),
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'student',
      mobileNumber: 9876543210,
      password: 'anotherSalt.anotherHash',
      department: departmentId,
      sem: '2',
      authToken: 'anotherSampleAuthToken',
    };

    const mockDepartment = {
      _id: departmentId,
      occupiedSeats: 10,
      availableSeats: 20,
    };

    jest
      .spyOn(studentModel, 'find')
      .mockResolvedValueOnce([mockStudent1, mockStudent2]);
    jest
      .spyOn(service.attendanceService, 'deleteManyAttendance')
      .mockResolvedValueOnce(undefined);
    jest.spyOn(studentModel, 'deleteMany').mockResolvedValueOnce(undefined);

    jest
      .spyOn(service, 'deleteStudents')
      .mockImplementationOnce(() =>
        service.deleteStudents(departmentId.toString()),
      );

    const result = await service.testDeleteStudents();

    expect(result).toEqual(undefined);
  });
});
