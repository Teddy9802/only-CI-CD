import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub_category } from '../sub_category/entity/sub_category.entity';
import { Product } from './entity/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sub_category])],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
