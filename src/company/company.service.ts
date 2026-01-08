import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OxService } from '../ox/ox.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ox: OxService,
  ) {}

  async registerCompany(userId: string, subdomain: string, token: string) {
    // validate token via OX
    try {
      await this.ox.getProfile(subdomain, token);
    } catch (e) {
      throw new UnauthorizedException('Token or subdomain is not valid');
    }

    const existing = await this.prisma.company.findUnique({ where: { subdomain } });

    if (!existing) {
      const company = await this.prisma.company.create({
        data: {
          subdomain,
          createdById: userId,
        },
      });

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          role: Role.ADMIN,
          companyId: company.id,
          oxToken: token,
        },
      });

      return {
        company,
        user: { id: user.id, email: user.email, role: user.role },
      };
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.MANAGER,
        companyId: existing.id,
        oxToken: token,
      },
    });

    return {
      company: existing,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async deleteCompany(companyId: string, userId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    if (company.createdById !== userId) {
      throw new ForbiddenException('You can delete only companies you added');
    }

    await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { companyId: companyId },
        data: { companyId: null, role: Role.MANAGER, oxToken: null },
      }),
      this.prisma.company.delete({ where: { id: companyId } }),
    ]);

    return { success: true };
  }
}
