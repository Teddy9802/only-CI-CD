import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //   jwtFromRequest: (req) => {
      //     console.log(req);
      //     const temp = req.headers.Authorization; // Bearer 토큰정보
      //     const accessToken = temp.toLowercase().replace('bearer ', '');
      //     return accessToken;
      //   },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accesserToken = req.headers.authorization.replace('Bearer', '');

    const result = await this.cacheManager.get(
      `accesserToken:${accesserToken}`,
    );
    console.log(result);

    if (result === 'accessToken') {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    console.log('dddd');
    console.log(payload);

    return {
      email: payload.email,
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
