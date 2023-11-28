import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User ,userSchema } from './Schemas/user.schema';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = userSchema;
          schema.pre('save', () => {});
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService,AuthService],
})
export class UserModule {}
