import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  skip? = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit? = 10;
}
