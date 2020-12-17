import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES, STATUS } from 'src/shared/static/constants';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  user: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false, default: ROLES.seller.toString() })
  rol: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({
    type: String,
    required: true,
    default: STATUS.delete.toPrecision,
    enum: [STATUS.active.toString(), STATUS.delete.toString()],
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
