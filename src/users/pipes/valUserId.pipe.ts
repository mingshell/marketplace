import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class ValUserIdPipe implements PipeTransform {
  constructor(private usersService: UsersService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (!value) return value;
      const user = await this.usersService.findOne(value);
      if (!user) throw new BadRequestException(metadata.data + ' no existe');
    } catch (error) {
      throw new BadRequestException(metadata.data + ' no existe');
    }
    return value;
  }
}
