import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule, UserModule],
  providers: [TagService, JwtAuthGuard, AdminGuard],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
