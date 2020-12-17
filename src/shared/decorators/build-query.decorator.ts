import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export const BuildQuery = createParamDecorator(
  async <T>(
    model: ClassType<T>,
    ctx: ExecutionContext,
  ): Promise<Partial<T>> => {
    const request: Request = ctx.switchToHttp().getRequest();
    let queryModeled: Partial<T> = plainToClass(
      model,
      Object.entries(request.body).length !== 0 ? request.body : request.query,
    );
    let resV = await validate(queryModeled);
    console.log(queryModeled);
    if (resV.length > 0) throw new BadRequestException(resV);
    return queryModeled;
  },
);
