import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie; // refreshToken=암호화된 문자
        const refreshToken = cookie.replace('refreshToken= ', '');
        return refreshToken;
      },
      secretOrKey: process.env.JWT_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refresherToken = req.headers.replace('refreshToken=', '');

    const result = await this.cacheManager.get(
      `refresherToken:${refresherToken}`,
    );

    if (result) {
      throw new UnauthorizedException('로그아웃된 토큰입니다.');
    }
    console.log(payload);
    return {
      email: payload.email,
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
