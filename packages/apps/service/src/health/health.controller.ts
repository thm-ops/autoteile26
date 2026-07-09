import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('/api/health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly typeOrm: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.typeOrm.pingCheck('database')]);
  }
}
