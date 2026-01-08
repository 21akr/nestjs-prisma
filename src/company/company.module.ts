import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OxModule } from '../ox/ox.module';

@Module({
  imports: [PrismaModule, OxModule],
  controllers: [CompanyController],
  providers: [CompanyService, RolesGuard],
})
export class CompanyModule {}
