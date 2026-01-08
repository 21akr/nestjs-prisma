import { Controller, Get, Query, Req } from '@nestjs/common';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Req() req: any, @Query() query: GetProductsQueryDto) {
    return this.productsService.getProducts(req.user.id, query.page, query.size);
  }
}
