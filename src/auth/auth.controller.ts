import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginQueryDto } from './dto/login-query.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginRes } from './interface/login-res.interface';
import { RefreshTokenRes } from './interface/refresh-token-res.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() payload: RegisterDto) {
    return this.authService.signup(payload);
  }

  @Post('signin')
  signin(
    @Body() payload: LoginDto,
    @Query() params: LoginQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginRes> {
    const { isMobile } = params;
    return this.authService.signIn(payload, isMobile, res);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Query() params: LoginQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenRes> {
    const { isMobile } = params;
    return this.authService.refreshAccessToken(
      refreshAccessTokenDto,
      isMobile,
      response,
    );
  }

  @Patch('revoke')
  async revokeRefreshToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.revokeRefreshToken(refreshAccessTokenDto, response);
  }

  @Delete('refresh-token/clear')
  async clearRefreshToken(@Query('userId') userId: string) {
    return this.authService.clearRefreshToken(+userId);
  }
}
