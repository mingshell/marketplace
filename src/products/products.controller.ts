import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuildQuery } from '../shared/decorators/build-query.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ValUserIdPipe } from '../users/pipes/valUserId.pipe';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './dtos/create.product.dto';
import { QueryProductDto } from './dtos/query.product.dto';
import { ProductsService } from './products.service';
import { generateSKU } from './utils/generate.sku';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}
  /**
   * CREACIÓN DE PRODUCTO
   * @param CreateProductDto
   */
  @Post('/')
  @Roles('admin', 'seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Res() res, @Body() createProductDto: CreateProductDto) {
    // VALIDACION DE DATOS

    let product = await this.productsService.findOneBySKU(createProductDto.sku);
    if (product)
      throw new NotFoundException(
        'el sku ya existe, igrese uno nuevo por favor. ej: ' + generateSKU(),
      );
    let user = await this.usersService.findOne(createProductDto.sellerId);
    if (!user) throw new NotFoundException('sellerId no existe');

    // GUARDAR DATOS
    let productCreated = await this.productsService.create(createProductDto);
    return res.status(HttpStatus.CREATED).json({
      data: productCreated,
      message: 'Producto creado con exito',
    });
  }

  /**
   * OBTENER PRODUCTOS
   * @param res
   */
  @Get('/')
  async get(
    @Res() res,
    @BuildQuery(QueryProductDto)
    data: Partial<QueryProductDto>,
  ) {
    var priceQuery = {};
    let query = { status: 'active' };
    if (data.title) query['title'] = new RegExp(data.title, 'i');
    if (data.priceMin) priceQuery['$gte'] = data.priceMin;
    if (data.priceMax) priceQuery['$lte'] = data.priceMax;
    if (data.sku) query['sku'] = data.sku;
    query['price'] = priceQuery;
    let productsFound = await this.productsService.findAll(query);
    return res.status(HttpStatus.OK).json({
      data: productsFound,
    });
  }

  /**
   * OBTENER MI INVENTARIO
   * @param res
   */
  @Get('/inventory')
  @Roles('admin', 'seller')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async inventory(
    @Res() res,
    @Req() req,
    @Query('sellerId', ValUserIdPipe) sellerId: string,
  ) {
    let productsFound = [];
    if (req.user.rol == 'admin') {
      // Si el usuario es administrador
      if (sellerId)
        productsFound = await this.productsService.findAll({
          sellerId: sellerId,
        });
      if (!sellerId) productsFound = await this.productsService.findAll();
    } else {
      // Si el usuario no es administrador
      if (sellerId && sellerId !== req.user._id)
        throw new BadRequestException('sellerId no existe');
      productsFound = await this.productsService.findAll({
        sellerId: req.user._id,
        status: 'active',
      });
    }
    // respuesta
    return res.status(HttpStatus.OK).json({
      data: productsFound,
    });
  }
}
