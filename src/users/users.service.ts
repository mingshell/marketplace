import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { STATUS } from 'src/shared/static/constants';
import { UserDto } from './dtos/users.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userDto: UserDto): Promise<User> {
    return new this.userModel(userDto).save();
  }

  async findAll(query: any): Promise<User[]> {
    return await this.userModel.find(query).exec();
  }

  async findOne(userId: String): Promise<User> {
    return await this.userModel.findById(userId).exec();
  }
  async findByUser(user: string): Promise<User> {
    var users = await this.userModel
      .find({ user: user, status: STATUS.active.toString() })
      .exec();
    if (users.length > 0) return users[0];
    return null;
  }

  async update(userId: String, userDto: Partial<UserDto>): Promise<User> {
    userDto['updatedAt'] = Date.now();
    return await this.userModel
      .findByIdAndUpdate(userId, userDto, { new: true })
      .exec();
  }

  async delete(userId: String): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        { status: STATUS.delete.toString() },
        { new: true },
      )
      .exec();
  }
}
