import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

const sessionCookie = {
  httpOnly: true,
  signed: true,
  sameSite: 'lax' as const,
  secure: false,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { login?: string; password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.login(body.login ?? '', body.password ?? '');
    res.cookie('session', user.id, sessionCookie);
    return { login: user.login };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('session', { path: '/' });
    return { ok: true };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const userId = req.signedCookies?.session;
    if (typeof userId !== 'string' || !userId) {
      throw new UnauthorizedException('Нет сессии');
    }
    const user = await this.auth.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Нет сессии');
    }
    return user;
  }
}
