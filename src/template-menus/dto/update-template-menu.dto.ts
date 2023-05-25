import { PartialType } from '@nestjs/swagger';
import { CreateTemplateMenuDto } from './create-template-menu.dto';

export class UpdateTemplateMenuDto extends PartialType(CreateTemplateMenuDto) {}
