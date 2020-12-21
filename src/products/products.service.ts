import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { STATUS } from '../shared/static/constants';
import { CreateProductDto } from './dtos/create.product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return new this.productModel(createProductDto).save();
  }

  async findAll(query: any = {}): Promise<Product[]> {
    return await this.productModel.find(query).exec();
  }

  async findOneBySKU(sku: string): Promise<Product> {
    var users = await this.productModel.find({ sku: sku }).exec();
    if (users.length > 0) return users[0];
    return null;
  }

  async delete(sku: String): Promise<Product> {
    return await this.productModel
      .findByIdAndUpdate(sku, { status: STATUS[1] }, { new: true })
      .exec();
  }
}
