import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TemplateMenusService } from './template-menus.service';
import { CreateTemplateMenuDto } from './dto/create-template-menu.dto';
import { UpdateTemplateMenuDto } from './dto/update-template-menu.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AdministratorGuard } from 'src/common/guard/administrator.guard';

@ApiTags('Template Menu')
@Controller('template-menus')
@UseGuards(JwtGuard, AdministratorGuard)
export class TemplateMenusController {
  constructor(private readonly templateMenusService: TemplateMenusService) {}

  @Post()
  create(@Body() createTemplateMenuDto: CreateTemplateMenuDto) {
    return this.templateMenusService.create(createTemplateMenuDto);
  }

  @Get()
  findAll() {
    return this.templateMenusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templateMenusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateMenuDto: UpdateTemplateMenuDto,
  ) {
    return this.templateMenusService.update(id, updateTemplateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.templateMenusService.remove(id);
  }
}
