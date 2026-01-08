import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminOnly } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompanyService } from './company.service';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register-company')
  async registerCompany(@Req() req: any, @Body() dto: RegisterCompanyDto) {
    return this.companyService.registerCompany(req.user.id, dto.subdomain, dto.token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Delete('company/:id')
  async deleteCompany(@Req() req: any, @Param('id') id: string) {
    return this.companyService.deleteCompany(id, req.user.id);
  }
}
