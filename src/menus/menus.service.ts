import { HttpException, Injectable } from '@nestjs/common';
import { Menu } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuType } from 'src/types/index.type';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    try {
      const slug = await this.createSlug(createMenuDto.name);
      return await this.prismaService.menu.create({
        data: { slug, ...createMenuDto },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll(type: string) {
    const newType = type || MenuType.tree;

    try {
      const menus = await this.prismaService.menu.findMany();

      if (newType === MenuType.original) {
        return menus;
      }

      const menuTree = this.configService.createMenuTree(menus);

      if (newType === MenuType.tree) {
        return menuTree;
      }

      return this.configService.createMenuSingle(menuTree);
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(slug: string): Promise<Menu> {
    try {
      return await this.prismaService.menu.findUnique({ where: { slug } });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(slug: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    try {
      return await this.prismaService.menu.update({
        where: { slug },
        data: updateMenuDto,
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(slug: string) {
    try {
      await this.prismaService.menu.update({
        where: { slug },
        data: { accessMenus: { deleteMany: {} } },
        include: { accessMenus: true },
      });

      await this.prismaService.menu.delete({ where: { slug } });

      return { message: `Menu ${slug} has been deleted` };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async createSlug(name: string): Promise<string> {
    const initialSlug = name
      .toLowerCase()
      .replace(/[\s\n\t]/g, '-')
      .replace(/['",.;:@#$%^&*]/g, '');
    const slugs = await this.prismaService.menu.findMany({
      select: { slug: true },
    });

    const isSlugExist = slugs.some((itemSlug) => itemSlug.slug === initialSlug);

    if (isSlugExist) {
      const splited = initialSlug.split('-');
      const lastSplit = splited[splited.length - 1];
      const isNanLastSplit = Number.isNaN(+lastSplit);
      const slug = isNanLastSplit
        ? [...splited, 2].join('-')
        : [...splited.slice(0, splited.length - 2), +lastSplit + 1].join('-');
      return slug;
    }

    return initialSlug;
  }
}
