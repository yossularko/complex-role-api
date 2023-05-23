import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    try {
      return await this.prismaService.user.findMany({
        select: { id: true, profile: true },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.prismaService.user.findUnique({
        where: { id },
        include: { profile: true, accessMenus: true },
      });

      if (!item) {
        // optional, you can return null/undefined depending on your use case
        throw new NotFoundException(`User id ${id} is not found`);
      }

      delete item.hashedPassword;

      return item;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, name, bio, alamat, avaImage, bgImage } = updateUserDto;

    try {
      const item = await this.prismaService.user.update({
        where: { id },
        data: {
          email,
          profile: {
            update: { name, bio, avaImage, bgImage, alamat },
          },
        },
        include: { profile: true },
      });

      delete item.hashedPassword;

      return item;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { profile: { delete: true }, accessMenus: { set: [] } },
        include: { profile: true, accessMenus: true },
      });
      await this.prismaService.user.delete({
        where: { id },
      });
      return { message: `User id: ${id} was deleted` };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }
}
