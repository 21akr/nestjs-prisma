import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { OxModule } from './ox/ox.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, OxModule, AuthModule, CompanyModule, ProductsModule],
})
export class AppModule {}
