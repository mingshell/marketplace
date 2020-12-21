import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserDto } from './dtos/users.dto';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  /**
   * CREACIöN DE USUARIO
   * @param userDto --> UserDto
   */
  @Post('/')
  async create(@Res() res, @Body() userDto: UserDto) {
    let users = await this.usersService.findAll({ user: userDto.user });
    if (users.length > 0)
      throw new ConflictException('El usuario ya se encuntra registrado');
    userDto.password = bcrypt.hashSync(userDto.password, 10);
    let userCreated = await this.usersService.create(userDto);
    let token = await this.authService.login(userCreated);
    token['id'] = userCreated._id;
    return res.status(HttpStatus.CREATED).json({
      data: token,
      message: 'Usuario creado con exito',
    });
  }

  /**
   * OBTENER USUARIOS
   * @param userDto --> UserDto
   */
  @Get('/')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async get(@Res() res) {
    let usersFound = await this.usersService.findAll({});
    let users = [];
    usersFound.forEach(item => {
      let user = item.toJSON();
      delete user.password;
      users.push(user);
    });
    return res.status(HttpStatus.OK).json({
      data: users,
    });
  }
}
