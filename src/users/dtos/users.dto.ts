import { IsEmail, IsEmpty, Length } from 'class-validator';

export class UserDto {
  @IsEmail({}, { message: 'Ingresa un correo valido' })
  user: string;

  @Length(6, 50, {
    message: 'La contraseña debe ser mayor o igual a 6 caracteres',
  })
  password: string;
}
