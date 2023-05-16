import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtKey, jwtSecret } from 'src/utils/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: true, // for production should be false
      secretOrKey: jwtSecret,
    });
  }

  private static extractJwt(req: Request): string | null {
    if (req.cookies && jwtKey in req.cookies) {
      return req.cookies[jwtKey];
    }

    return null;
  }

  async validate(payload: any) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      include: { accessMenus: true },
    });

    if (!user) {
      // optional, you can return null/undefined depending on your use case
      throw new NotFoundException(`User id ${payload.sub} is not found`);
    }

    delete user.hashedPassword;

    return user;
  }
}
