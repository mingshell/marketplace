import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES, STATUS } from '../../shared/static/constants';

@Schema()
export class Product extends Document {
  _id: false;

  @Prop({ type: String, unique: true, index: true, required: true })
  sku: string;

  @Prop({ type: String, required: true })
  sellerId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, required: true, default: 0 })
  quantity: number;

  @Prop({ type: Number, required: true, default: 0 })
  price: number;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({
    type: String,
    required: true,
    default: STATUS[0],
    enum: STATUS,
  })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
