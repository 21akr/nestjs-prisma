import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OxModule } from '../ox/ox.module';

@Module({
  imports: [PrismaModule, OxModule],
  controllers: [ProductsController],
  providers: [ProductsService, RolesGuard],
})
export class ProductsModule {}
