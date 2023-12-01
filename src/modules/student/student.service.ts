import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Student } from './Schemas/student.schema';
import mongoose from 'mongoose';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { DepartmentService } from '../department/department.service';
import { join } from 'path';
import { StudentObject } from 'src/interfaces/student-secret.interface';
const jwt = require('jsonwebtoken');
const scrypt = promisify(_scrypt);
@Injectable()
export class StudentService {
  private studentObj: object;
  setStudentObj(studentObj: object) {
    this.studentObj = studentObj;
  }
  getStudentObj() {
    return this.studentObj;
  }
  constructor(@InjectModel(Student.name) private studentModel: mongoose.Model<Student>, private deptService: DepartmentService) { }

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
      const privatekey = fs.readFileSync(join(__dirname, '../../../keys/Private.key'));
      const token = jwt.sign({ id: student.id.toString(), role: student.role }, privatekey, { algorithm: 'RS256' });
      student.authToken = token;
      await student.save();
      return student;
    } catch (error) {
      throw error;
    }
  }
  async create(createStudentDto: CreateStudentDto) {
    try {
      const department = await this.deptService.findOne(createStudentDto.department);
      if (!department) {
        throw new BadRequestException("Department not found");
      }
      if (department.occupiedSeats === department.availableSeats) {
        throw new BadRequestException("NO vacancy available");
      }
      department.occupiedSeats += 1;
      await department.save();
      const newStudent = await this.studentModel.create(createStudentDto);
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

  async findOne(id: string) {
    try {
      return await this.studentModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
