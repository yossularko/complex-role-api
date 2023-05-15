import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AccessMenusService } from './access-menus.service';
import { CreateAccessMenuDto } from './dto/create-access-menu.dto';
import { UpdateAccessMenuDto } from './dto/update-access-menu.dto';

@Controller('access-menus')
@UseGuards(JwtGuard)
export class AccessMenusController {
  constructor(private readonly accessMenusService: AccessMenusService) {}

  @Post()
  create(
    @Body() createAccessMenuDto: CreateAccessMenuDto,
    @GetUser() user: User,
  ) {
    return this.accessMenusService.create(createAccessMenuDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.accessMenusService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accessMenusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccessMenuDto: UpdateAccessMenuDto,
  ) {
    return this.accessMenusService.update(id, updateAccessMenuDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accessMenusService.remove(id);
  }
}
