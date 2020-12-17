import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ValProductSKUPipe implements PipeTransform {
  constructor(private productsService: ProductsService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const product = await this.productsService.findOneBySKU(value);
    if (!product)
      throw new BadRequestException(metadata.data ?? 'sku no existe');
    return value;
  }
}
