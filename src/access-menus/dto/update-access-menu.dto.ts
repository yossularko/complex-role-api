import { PartialType } from '@nestjs/swagger';
import { CreateAccessMenuDto } from './create-access-menu.dto';

export class UpdateAccessMenuDto extends PartialType(CreateAccessMenuDto) {}
