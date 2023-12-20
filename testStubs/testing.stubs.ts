import { Types } from 'mongoose';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
const Admin: CreateUserDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: 'brook',
    email: 'brook@gmail.com',
    password: '123',
    designation: 'teacher',
    mobileNumber: 6361775548,
    department: 'Management',
    role: 'ADMIN'
};
export {
    Admin
}