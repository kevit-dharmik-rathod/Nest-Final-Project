import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Student } from './Schemas/student.schema';
import mongoose, { Types } from 'mongoose';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { DepartmentService } from '../department/department.service';
import { join } from 'path';
import { StudentObject } from '../../interfaces/student-secret.interface';
import { UpdateStudentOtherFields } from './dto/update-student-fields.dto';
import { AttendanceService } from '../attendance/attendance.service';
const jwt = require('jsonwebtoken');
const scrypt = promisify(_scrypt);
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  private studentObj: object;
  setStudentObj(studentObj: object) {
    this.studentObj = studentObj;
  }
  getStudentObj() {
    return this.studentObj;
  }
  constructor(
    @InjectModel(Student.name) private studentModel: mongoose.Model<Student>,
    @Inject(forwardRef(() => DepartmentService))
    private deptService: DepartmentService,
    @Inject(forwardRef(() => AttendanceService))
    private attendanceService: AttendanceService,
  ) {}

  async login(email: string, password: string) {
    try {
      const student = await this.studentModel.findOne({ email });
      if (!student) {
        throw new NotFoundException('student not found');
      }
      const [salt, storedHash] = student.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('password is incorrect');
      }
      const privatekey = fs.readFileSync(
        join(__dirname, '../../../keys/Private.key'),
      );
      const token = jwt.sign(
        { id: student.id.toString(), role: student.role },
        privatekey,
        { algorithm: 'RS256' },
      );
      student.authToken = token;
      await student.save();
      return student;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<String> {
    try {
      const { id } = this.studentObj as StudentObject;
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new BadRequestException('Student not found');
      }
      student.authToken = undefined;
      await student.save();
      return 'Student logout successfully';
    } catch (error) {
      throw error;
    }
  }
  async create(createStudentDto: CreateStudentDto) {
    try {
      const department = await this.deptService.findOne(
        createStudentDto.department.toString(),
      );
      if (!department) {
        throw new BadRequestException('Department not found');
      }
      if (department.occupiedSeats === department.availableSeats) {
        throw new BadRequestException('NO vacancy available');
      }
      createStudentDto.department = new Types.ObjectId(
        createStudentDto.department,
      );
      const newStudent = await this.studentModel.create(createStudentDto);
      department.occupiedSeats += 1;
      await department.save();
      const tempPassword = newStudent.password;
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(tempPassword, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      newStudent.password = result;
      await newStudent.save();
      return newStudent;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.studentModel.find({});
    } catch (error) {
      throw error;
    }
  }

  async showMyProfile() {
    try {
      const { id } = this.studentObj as StudentObject;
      return await this.studentModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateMyPassword(body: object): Promise<String> {
    try {
      const { id } = this.studentObj as StudentObject;
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new NotFoundException('Student does not exist');
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(body['password'], salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      student.password = result;
      await student.save();
      return 'Password updated successfully';
    } catch (error) {}
  }
  async findOne(id: string) {
    try {
      return await this.studentModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, body: UpdateStudentOtherFields): Promise<String> {
    const student = await this.studentModel.findById(id);
    const { department: studentExistingDepartment } = student;
    console.log('student existing dept is ', studentExistingDepartment);
    const { department: studentNewDepartment } = body;
    console.log('student new department is ', studentNewDepartment);
    const newDepartment = await this.deptService.findOne(studentNewDepartment);
    console.log('student find new department is ', newDepartment);
    if (!newDepartment) {
      throw new NotFoundException('Provided new department does not exist');
    }
    if (!student) {
      throw new NotFoundException('Student does not exist');
    }
    Object.assign(student, body.name, body.email, body.mobileNumber, body.sem);
    const exist_dep = await this.deptService.findOne(
      studentExistingDepartment.toString(),
    );
    console.log('student service exist_dep is ', exist_dep);
    if (body.hasOwnProperty('department')) {
      if (newDepartment.occupiedSeats >= newDepartment.availableSeats) {
        throw new BadRequestException('No vacancies in provided department');
      } else {
        exist_dep.occupiedSeats -= 1;
        await exist_dep.save();
        newDepartment.occupiedSeats += 1;
        await newDepartment.save();
        Object.assign(student, newDepartment);
        await student.save();
      }
    }

    return 'department updated successfully';
  }
  async remove(id: string): Promise<String> {
    const student = await this.studentModel.findById(id);
    const { department: studentExistingDepartment } = student;
    const department = await this.deptService.findOne(
      studentExistingDepartment.toString(),
    );
    department.occupiedSeats -= 1;
    await department.save();
    await this.attendanceService.deleteManyAttendance(id);
    await this.studentModel.findByIdAndDelete(id);
    return 'student deleted successfully';
  }
  async deleteStudents(deptId: string) {
    const newId = new Types.ObjectId(deptId);
    const allStudents = await this.studentModel.find({ department: newId });
    for (const student of allStudents) {
      console.log(student._id);
      await this.attendanceService.deleteManyAttendance(student._id.toString());
    }
    return await this.studentModel.deleteMany({ department: newId });
  }

  async clearStudents() {
    try {
      await this.studentModel.deleteMany({});
    } catch (error) {}
  }
}
