import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OxService } from '../ox/ox.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ox: OxService,
  ) {}

  async getProducts(userId: string, page: number, size: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.company)
      throw new BadRequestException({
        code: 'COMPANY_NOT_LINKED',
        message: 'User is not linked to a company',
      });
    if (!user.oxToken) throw new BadRequestException({ code: 'OX_TOKEN_MISSING', message: 'OX token is missing' });

    return this.ox.getVariations(user.company.subdomain, user.oxToken, { page, size });
  }
}
