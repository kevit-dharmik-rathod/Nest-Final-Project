import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';
import { Student } from '../src/modules/student/Schemas/student.schema';
import { User } from '../src/modules/user/Schemas/user.schema';
import { Department } from '../src/modules/department/Schemas/dept.schema';
import { Attendance } from '../src/modules/attendance/Schemas/attendance.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testUser: User;
  let adminAuthToken: string;
  let studentId: mongoose.Types.ObjectId;
  let userAdminId: mongoose.Types.ObjectId;
  let dummyUserId: mongoose.Types.ObjectId;
  let userStaffId: mongoose.Types.ObjectId;
  let departmentId: mongoose.Types.ObjectId;

  const dummyAdmin = {
    name: 'john',
    password: 'john12',
    email: 'john@gmail.com',
    designation: 'Head of Department',
    mobileNumber: 6361775548,
    department: 'teaching',
    role: 'ADMIN',
  };

  const dummyUser = {
    name: 'test',
    password: 'test12',
    email: 'test@gmail.com',
    designation: 'Professor',
    mobileNumber: 63517788899,
    department: 'teaching',
    role: 'STAFF',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('User Endpoints', () => {
    let adminAuthToken: string;

    beforeAll(async () => {
      // Log in as admin and get the auth token
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: 'john@gmail.com', password: 'john12' });

      adminAuthToken = response.body.authToken;
    });

    it('Create Admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/add')
        .send(dummyAdmin)
        .expect(201);

      adminAuthToken = response.body.authToken;
      userAdminId = response.body.id;
    });

    it('should create a new user if user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/add')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send(dummyUser)
        .expect(201);

      dummyUserId = response.body.id;
    });

    it('should get all users if user is admin', async () => {
      await request(app.getHttpServer())
        .get('/user/getAll')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
    });
  });

  describe('Student Endpoints', () => {
    it('should create a new student if user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/student/add')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          name: 'Student Name',
          email: 'student@example.com',
          department: 'teaching',
          mobileNumber: 1234567890,
          sem: 3,
        })
        .expect(201);

      studentId = response.body.id;
    });

    it('should get all students if user is admin', async () => {
      await request(app.getHttpServer())
        .get('/student/getall')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
    });
  });

  describe('Department Endpoints', () => {
    it('should create a new department if user is admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/department/add')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ name: 'New Department', seats: 50 })
        .expect(201);

      departmentId = response.body.id;
    });

    it('should get all departments if user is admin', async () => {
      await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
    });
  });

  describe('Attendance Endpoints', () => {
    it('should record attendance for a student if user is admin', async () => {
      await request(app.getHttpServer())
        .post('/attendance/mark')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({ studentId, status: 'present' })
        .expect(201);
    });

    it('should get attendance for a student if user is admin', async () => {
      await request(app.getHttpServer())
        .get(`/attendance/get/${studentId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
    });
  });
});
