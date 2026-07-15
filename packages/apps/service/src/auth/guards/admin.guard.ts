import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import type { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * Must run after JwtAuthGuard, which populates request.user.
 * Re-reads the user's isAdmin flag from the database on every request
 * instead of trusting the JWT, so revoking admin rights takes effect
 * immediately instead of waiting for the token to expire.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.sub;
    const user = userId ? await this.userService.findById(userId) : null;

    if (!user?.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
