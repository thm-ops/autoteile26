import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('/api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const servicePort =
      this.configService.get<string>('SERVICE_PORT') ?? '3000';

    return this.health.check([
      () => this.http.pingCheck('backend', `http://localhost:${servicePort}`),
      () => this.typeOrm.pingCheck('database'),
    ]);
  }
}
