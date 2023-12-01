import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../user/decorators/user.decorator';
import { LoginStudentDto } from './dto/login-student.dto';

@Controller('student')
export class StudentController {
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
  findAll() {
    return this.studentService.findAll();
  }

  @Get('/me')

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
