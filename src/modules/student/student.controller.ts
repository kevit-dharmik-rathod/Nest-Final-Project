import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
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
  constructor(private readonly studentService: StudentService) { }

  @Post('/login')
  studentLogin(@Body() credentials: LoginStudentDto) {
    return this.studentService.login(credentials.email, credentials.password);
  }

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get('/getall')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async findAll() {
    return await this.studentService.findAll();
  }

  @Get('/me')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  async whoami() {
    return await this.studentService.showMyProfile();
  }

  @Post('/logout')
  async studentLogout() {
    return await this.studentService.logout();
  }

  @Patch('/update/me')
  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  updateMyProfile(@Body() body: UpdateStudentPasswordDto) {
    return this.studentService.updateMyPassword(body);
  }

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch('/update/admin/:id')
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateStudentOtherFields) {
    return this.studentService.update(id, body);
  }

  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  @Roles('STAFF', 'ADMIN')
  async remove(@Param('id') id: string): Promise<String> {
    return await this.studentService.remove(id);
  }
}
