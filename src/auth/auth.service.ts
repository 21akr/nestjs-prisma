import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          role: Role.MANAGER,
        },
      });
    }

    const otp = this.makeOtp();
    const expiresInMin = Number(this.config.get<string>('OTP_EXPIRES_MIN', '5')) || 5;
    const otpExpiresAt = new Date(Date.now() + expiresInMin * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiresAt },
    });

    return {
      email: user.email,
      otp,
      otpExpiresAt,
      role: user.role,
    };
  }

  async verify(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new UnauthorizedException('OTP not found');
    }

    if (user.otpCode !== otp) {
      throw new UnauthorizedException('Wrong OTP');
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('OTP expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiresAt: null },
    });

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
    };
  }

  private makeOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
}
