import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { AccessMenu } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { Menu, MenuRes } from 'src/config/interface/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuType } from 'src/types/index.type';
import { CreateAccessMenuListDto } from './dto/create-access-menu-list.dto';
import { CreateAccessMenuDto } from './dto/create-access-menu.dto';
import { QueryAccessMenuDto } from './dto/query-access-menu.dto';
import { UpdateAccessMenuDto } from './dto/update-access-menu.dto';

@Injectable()
export class AccessMenusService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createAccessMenuDto: CreateAccessMenuDto): Promise<AccessMenu> {
    const { userId, actions, menuSlug } = createAccessMenuDto;
    try {
      const slugs = await this.getSlugs(userId);
      const isExist = slugs.some((item) => item.menuSlug === menuSlug);

      if (isExist) {
        throw new ForbiddenException(`Menu ${menuSlug} is exist`);
      }

      return await this.prismaService.accessMenu.create({
        data: {
          actions,
          Menu: { connect: { slug: menuSlug } },
          User: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async createMenus(createAccessMenuListDto: CreateAccessMenuListDto) {
    const { userId, menus } = createAccessMenuListDto;
    try {
      await this.prismaService.accessMenu.deleteMany({ where: { userId } });

      const menuList = await Promise.all(
        menus.map(async (menu) => {
          const dataMenu: CreateAccessMenuDto = {
            actions: menu.actions,
            menuSlug: menu.menuSlug,
            userId,
          };

          return await this.create(dataMenu);
        }),
      );

      return {
        message: `Success update access menu userId: ${userId}`,
        data: menuList,
      };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll(query: QueryAccessMenuDto): Promise<MenuRes[]> {
    const { userId, type } = query;
    const newType = type || MenuType.tree;

    if (Number.isNaN(userId)) {
      throw new BadRequestException('userId is not a number!');
    }
    try {
      const menus = await this.prismaService.accessMenu.findMany({
        where: { userId },
        include: { Menu: true },
      });

      const newMenu: Menu[] = menus.map((item) => ({
        accessMenuId: item.id,
        ...item.Menu,
        actions: item.actions,
      }));

      if (newType === MenuType.original) {
        return newMenu;
      }

      const menuTree = this.configService.createMenuTree(newMenu);

      if (newType === MenuType.tree) {
        return menuTree;
      }

      return this.configService.createMenuSingle(menuTree);
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
          Menu: menuSlug ? { connect: { slug: menuSlug } } : undefined,
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

  async getSlugs(userId: number) {
    try {
      return await this.prismaService.accessMenu.findMany({
        where: { userId },
        select: { menuSlug: true },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
