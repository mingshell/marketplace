import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { limpiarCadena } from '../utils/limpiarCadena';

export class CreateProductDto {
  @IsMongoId({ message: 'sellerId debe ser de tipo mongodb id' })
  sellerId: string;

  @IsString({ message: 'title debe ser de tipo string' })
  @IsNotEmpty({ message: 'el parametro title no debe estar vacío ' })
  @Transform((value: string) => value.charAt(0).toUpperCase() + value.slice(1))
  title: string;

  @IsString({ message: 'sku debe ser de tipo string' })
  @IsNotEmpty({ message: 'el parametro sku no debe estar vacío ' })
  @Transform((value: string) => limpiarCadena(value))
  sku: string;

  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    {
      message: 'quantity debe ser de tipo number | float [2 decimales maximo]',
    },
  )
  @Min(0, { message: 'quantity debe ser mayor o igual a 0' })
  quantity: number;

  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    {
      message: 'price debe ser de tipo number | float [2 decimales maximo]',
    },
  )
  @Min(0, { message: 'price debe ser mayor o igual a 0' })
  price: number;
}
