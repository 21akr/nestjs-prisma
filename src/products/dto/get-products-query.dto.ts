import { IsInt, Max, Min } from 'class-validator';

export class GetProductsQueryDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(20)
  size: number = 10;
}
