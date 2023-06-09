import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Response } from 'express';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { jwtKey, jwtRefresh } from 'src/utils/constant';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoginRes } from './interface/login-res.interface';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { RefreshTokenRes } from './interface/refresh-token-res.interface';
import { ConfigService } from 'src/config/config.service';
import { Menu } from 'src/config/interface/config.interface';
import { MenusService } from 'src/menus/menus.service';
import { MenuType } from 'src/types/index.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly menusService: MenusService,
    private jwtService: JwtService,
  ) {}

  // createUserData: Prisma.UserCreateInput
  async signup(createUserData: RegisterDto): Promise<User> {
    const { name, email, password } = createUserData;

    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (foundUser) {
        throw new BadRequestException('Email already exist');
      }

      const hashedPassword = await this.hashPassword(password);

      return await this.prismaService.user.create({
        data: {
          email,
          hashedPassword,
          profile: { create: { name } },
        },
        include: { profile: true },
      });
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async signIn(
    loginDto: LoginDto,
    isMobile: string,
    res: Response,
  ): Promise<LoginRes> {
    const { email, password } = loginDto;

    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: { email },
        include: { profile: true, accessMenus: { include: { Menu: true } } },
      });

      if (!foundUser) {
        throw new UnauthorizedException('Wrong credentials');
      }

      const isMatch = await this.comparePasswords({
        password,
        hash: foundUser.hashedPassword,
      });

      if (!isMatch) {
        throw new UnauthorizedException('Wrong email or password');
      }

      const access_token = await this.createAccessToken(foundUser);
      const refresh_token = await this.createRefreshToken(foundUser);

      delete foundUser.hashedPassword;

      const { accessMenus, ...rest } = foundUser;

      const masteMenu = await this.menusService.findAll(MenuType.list);

      const initialAccessMenu: Menu[] = accessMenus.map((item) => ({
        accessMenuId: item.id,
        ...item.Menu,
        actions: item.actions,
      }));

      const compareMenu: Menu[] = masteMenu.map((val) => {
        const idx = initialAccessMenu.findIndex(
          (initMenu) => initMenu.slug === val.slug,
        );
        if (idx !== -1) {
          return initialAccessMenu[idx];
        }

        return val;
      });

      const validAccessMenu: Menu[] = compareMenu.filter(
        (validMenu) => typeof validMenu.accessMenuId === 'number',
      );

      const newAccessMenu = this.configService.createMenuTree(validAccessMenu);

      if (isMobile === 'true') {
        return {
          token: { access_token, refresh_token },
          user: rest,
          accessMenus: newAccessMenu,
        };
      }

      res.cookie(jwtKey, access_token, this.configCookie('auth', true));
      res.cookie(jwtRefresh, refresh_token, this.configCookie('refresh', true));

      return {
        token: { access_token: '', refresh_token },
        user: rest,
        accessMenus: newAccessMenu,
      };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
    isMobile: string,
    response: Response,
  ): Promise<RefreshTokenRes> {
    const { refresh_token } = refreshAccessTokenDto;
    try {
      const payload = await this.decodeToken(refresh_token);
      const refreshToken = await this.prismaService.refreshToken.findUnique({
        where: { id: payload.jid },
        include: { User: true },
      });

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not found');
      }

      if (refreshToken.isRevoked) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      const access_token = await this.createAccessToken(refreshToken.User);

      if (isMobile === 'true') {
        return { access_token };
      }

      response.cookie(jwtKey, access_token, this.configCookie('auth', true));

      return { access_token: '' };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async revokeRefreshToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
    response: Response,
  ) {
    const { refresh_token } = refreshAccessTokenDto;
    try {
      const payload = await this.decodeToken(refresh_token);
      await this.prismaService.refreshToken.update({
        where: { id: payload.jid },
        data: { isRevoked: true },
      });

      response.clearCookie(jwtKey);
      response.clearCookie(jwtRefresh);
      return { message: 'Token has been revoked' };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async clearRefreshToken(userId?: number) {
    try {
      await this.prismaService.refreshToken.deleteMany({
        where: Number.isNaN(userId) ? undefined : { userId },
      });
      return {
        message: `All Refresh Token ${
          userId ? `userId: ${userId} ` : ''
        }has been deleted`,
      };
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashed = await bcrypt.hash(password, saltOrRounds);

    return hashed;
  }

  async comparePasswords(args: { password: string; hash: string }) {
    const isMatch = await bcrypt.compare(args.password, args.hash);
    return isMatch;
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired!');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async createRefreshToken(user: User): Promise<string> {
    try {
      const expiredAt = new Date();
      expiredAt.setTime(
        expiredAt.getTime() + Number(refreshTokenConfig.expiresIn),
      );

      const refreshToken = await this.prismaService.refreshToken.create({
        data: {
          isRevoked: false,
          expiredAt,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const payload = { jid: refreshToken.id };

      const refresh_token = await this.jwtService.signAsync(
        payload,
        refreshTokenConfig,
      );

      return refresh_token;
    } catch (error) {
      throw new HttpException(error, 500, { cause: new Error(error) });
    }
  }

  configCookie(type: 'auth' | 'refresh', isLocal?: boolean): CookieOptions {
    const duration = type === 'auth' ? 3600 * 1000 : 3600 * 1000 * 24;

    const localConfig: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: duration,
      path: '/',
    };

    const onlineConfig: CookieOptions = {
      expires: new Date(new Date().getTime() + duration),
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    };

    return isLocal ? localConfig : onlineConfig;
  }
}
