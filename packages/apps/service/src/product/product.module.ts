import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, UserModule],
  providers: [ProductService, JwtAuthGuard, AdminGuard],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
