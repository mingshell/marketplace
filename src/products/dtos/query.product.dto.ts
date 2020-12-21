import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryProductDto {
  @IsString({ message: 'title debe ser de tipo string' })
  @IsNotEmpty({ message: 'el parametro title no debe estar vacío ' })
  @Transform((value: String) => value.charAt(0).toUpperCase() + value.slice(1))
  @IsOptional()
  title: string;

  @IsString({ message: 'sku debe ser de tipo string' })
  @IsNotEmpty({ message: 'el parametro sku no debe estar vacío ' })
  @IsOptional()
  sku: string;

  @IsNumber(
    {},
    {
      message: 'priceMin debe ser de tipo number | float [2 decimales maximo]',
    },
  )
  @Min(0, { message: 'priceMin debe ser mayor o igual a 0' })
  @Transform(value => Number.parseInt(value))
  @IsOptional()
  priceMin: number;

  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    {
      message: 'priceMax debe ser de tipo number | float [2 decimales maximo]',
    },
  )
  @Min(0, { message: 'priceMax debe ser mayor o igual a 0' })
  @Transform(value => Number.parseFloat(value))
  @IsOptional()
  priceMax: number;
}
