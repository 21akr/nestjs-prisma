import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OxModule } from '../ox/ox.module';

@Module({
  imports: [PrismaModule, OxModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
