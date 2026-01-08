import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  @Matches(/^[0-9]{6}$/)
  otp!: string;
}
