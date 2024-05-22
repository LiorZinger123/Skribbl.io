import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPassJwtStrategy extends PassportStrategy(Strategy, 'reset-pass-jwt') {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        const cookie = request?.cookies["ResetPassword"] || request?.cookies["CodeValidation"]
        return cookie?.accessToken
      }]),
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('jwt')
    });
  }

  async validate(payload: any) {
    return payload
  }
}