import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ResetPassJwtAuthGuard extends AuthGuard('reset-pass-jwt'){}