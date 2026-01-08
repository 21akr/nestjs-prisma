import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OxService {
  constructor(private readonly http: HttpService) {}

  async getProfile(subdomain: string, token: string) {
    return this.request(subdomain, token, 'profile');
  }

  async getVariations(subdomain: string, token: string, params: { page: number; size: number }) {
    return this.request(subdomain, token, 'variations', params);
  }

  private async request(subdomain: string, token: string, endpoint: string, params?: any) {
    const url = `https://${subdomain}.ox-sys.com/${endpoint}`;
    const rawToken = token.replace(/^Bearer\s+/i, '').trim();

    try {
      const res = await firstValueFrom(
        this.http.get(url, {
          params,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${rawToken}`,
          },
        }),
      );

      return res.data;
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status;

      if (status === 401) {
        throw new UnauthorizedException('OX token invalid');
      }

      const message = (err.response?.data as any)?.message || err.message || 'OX request failed';
      throw new BadRequestException(`OX request failed${status ? ` (${status})` : ''}: ${message}`);
    }
  }
}
