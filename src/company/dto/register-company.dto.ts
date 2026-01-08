import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  @MinLength(5)
  token!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/i)
  subdomain!: string;
}
