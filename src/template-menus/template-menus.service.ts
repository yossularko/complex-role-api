import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateMenuDto } from './dto/create-template-menu.dto';
import { UpdateTemplateMenuDto } from './dto/update-template-menu.dto';

@Injectable()
export class TemplateMenusService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createTemplateMenuDto: CreateTemplateMenuDto) {
    const { name, menus } = createTemplateMenuDto;

    try {
      const createTemplate = await this.prismaService.templateMenu.create({
        data: { name: name },
      });

      if (!createTemplate) {
        throw new InternalServerErrorException('Cannot create Template Menu');
      }

      const menuPosts = await Promise.all(
        menus.map(async (menu) => {
          return await this.prismaService.templateAccsMenu.create({
            data: {
              tempId: createTemplate.id,
              menuSlug: menu.menuSlug,
              actions: menu.actions,
            },
          });
        }),
      );

      return {
        message: 'Success Create Template Menu',
        data: {
          id: createTemplate.id,
          name: createTemplate.name,
          menus: menuPosts,
        },
      };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findAll() {
    try {
      return await this.prismaService.templateMenu.findMany();
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      const finded = await this.prismaService.templateMenu.findUnique({
        where: { id: id },
        include: { tempAccsMenus: { include: { Menu: true } } },
      });

      const newVal = finded.tempAccsMenus.map((item) => {
        return {
          tempAccsId: item.id,
          ...item.Menu,
          actions: item.actions,
        };
      });

      const menuTree = this.configService.createMenuTree(newVal);

      return { id, name: finded.name, menus: menuTree };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updateTemplateMenuDto: UpdateTemplateMenuDto) {
    const { name, menus } = updateTemplateMenuDto;
    try {
      await this.prismaService.templateAccsMenu.deleteMany({
        where: { tempId: id },
      });

      if (name) {
        await this.prismaService.templateMenu.update({
          where: { id },
          data: { name },
        });
      }

      const menuPosts = await Promise.all(
        menus.map(async (menu) => {
          return await this.prismaService.templateAccsMenu.create({
            data: {
              tempId: id,
              menuSlug: menu.menuSlug,
              actions: menu.actions,
            },
          });
        }),
      );

      return {
        message: 'Success Update Template Menu',
        data: {
          id,
          menus: menuPosts,
        },
      };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.templateMenu.update({
        where: { id },
        data: { tempAccsMenus: { deleteMany: {} } },
        include: { tempAccsMenus: true },
      });
      await this.prismaService.templateMenu.delete({ where: { id: id } });
      return { message: `Success delete template menu ${id}` };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
