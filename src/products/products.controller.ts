import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ManagerOnly } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ManagerOnly()
  @Get()
  async getProducts(@Req() req: any, @Query() query: GetProductsQueryDto) {
    return this.productsService.getProducts(req.user.id, query.page, query.size);
  }
}
