import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class QueryAccessMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;
}
