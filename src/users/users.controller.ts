import {
  Body,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserDto } from './dtos/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private usersService: UsersService) {}
  /**
   * CREACIöN DE USUARIO
   * @param userDto --> UserDto
   */
  @Post('/')
  async create(@Res() res, @Body() userDto: UserDto) {
    let users = await this.usersService.findAll({ user: userDto.user });
    if (users.length > 0)
      throw new ConflictException('El usuario ya se encuntra registrado');
    let userCreated = await this.usersService.create(userDto);
    return res.status(HttpStatus.CREATED).json({
      data: { _id: userCreated._id },
      message: 'Usuario creado con exito',
    });
  }
}
