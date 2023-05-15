import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { AccessMenu, User } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { Menu, MenuRes } from 'src/config/interface/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccessMenuDto } from './dto/create-access-menu.dto';
import { UpdateAccessMenuDto } from './dto/update-access-menu.dto';

@Injectable()
export class AccessMenusService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createAccessMenuDto: CreateAccessMenuDto,
    user: User,
  ): Promise<AccessMenu> {
    const { actions, menuSlug } = createAccessMenuDto;
    try {
      const slugs = await this.getSlugs();
      const isExist = slugs.some((item) => item.menuSlug === menuSlug);

      if (isExist) {
        throw new ForbiddenException(`Menu ${menuSlug} is exist`);
      }

      return await this.prismaService.accessMenu.create({
        data: {
          actions,
          Menu: { connect: { slug: menuSlug } },
          User: { connect: { id: user.id } },
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll(user: User): Promise<MenuRes[]> {
    try {
      const menus = await this.prismaService.accessMenu.findMany({
        where: { userId: user.id },
        include: { Menu: true },
      });

      const newMenu: Menu[] = menus.map((item) => ({
        accessMenuId: item.id,
        ...item.Menu,
        actions: item.actions,
      }));

      return this.configService.createMenuTree(newMenu);
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number): Promise<AccessMenu> {
    try {
      return await this.prismaService.accessMenu.findUnique({ where: { id } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(
    id: number,
    updateAccessMenuDto: UpdateAccessMenuDto,
  ): Promise<AccessMenu> {
    const { actions, menuSlug } = updateAccessMenuDto;
    try {
      return await this.prismaService.accessMenu.update({
        where: { id },
        data: {
          actions,
          Menu: { connect: { slug: menuSlug } },
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.accessMenu.delete({ where: { id } });
      return { message: `Access Menu ${id} has been deleted` };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async getSlugs() {
    try {
      return await this.prismaService.accessMenu.findMany({
        select: { menuSlug: true },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
