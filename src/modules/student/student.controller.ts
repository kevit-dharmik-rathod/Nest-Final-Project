import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../user/decorators/user.decorator';
import { LoginStudentDto } from './dto/login-student.dto';
import { UpdateStudentPasswordDto } from './dto/update-student-password.dto';
import { UpdateStudentOtherFields } from './dto/update-student-fields.dto';

@Controller('student')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);
  constructor(private readonly studentService: StudentService) {}

  /**
   * login router for student login
   * @param credentials for login
   * @returns student object
   */
  @Post('/login')
  @HttpCode(200)
  studentLogin(@Body() credentials: LoginStudentDto) {
    return this.studentService.login(credentials.email, credentials.password);
  }

  /**
   *
   * @param createStudentDto all properties required to create a new student
   * @returns student object
   */
  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  /**
   * get all students
   * @returns students array
   */
  @Get('/getall')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async findAll() {
    return await this.studentService.findAll();
  }

  /**
   *
   * @returns profile of logged in student
   */
  @Get('/me')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  async whoami() {
    return await this.studentService.showMyProfile();
  }

  /**
   *
   * @returns logged out current student
   */
  @Post('/logout')
  async studentLogout() {
    return await this.studentService.logout();
  }

  /**
   *
   * @param body only password allowed
   * @returns student object
   */
  @Patch('/update/me')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  updateMyProfile(@Body() body: UpdateStudentPasswordDto) {
    return this.studentService.updateMyPassword(body);
  }

  /**
   *
   * @param id student id
   * @returns student by given id
   */
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  //update student department
  /**
   *
   * @param id student id
   * @param body allow to change fields of student
   * @returns student object
   */
  @Patch('/update/admin/:id')
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateStudentOtherFields) {
    return this.studentService.update(id, body);
  }

  /**
   *
   * @param id student id
   * @returns string 'student deleted successfully'
   */
  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  async remove(@Param('id') id: string): Promise<String> {
    return await this.studentService.remove(id);
  }
}
