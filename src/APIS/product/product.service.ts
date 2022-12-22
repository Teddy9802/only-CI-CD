import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sub_category } from '../sub_category/entity/sub_category.entity';
import { Product } from './entity/product.entity';
import {
  ICreateInput,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interface/product-service.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Sub_category)
    private readonly sub_categoryRepository: Repository<Sub_category>,
  ) {}

  findOne({ id }: IProductsServiceFindOne) {
    return this.productRepository.findOne({
      where: { id },
    });
  }

  findAll() {
    return this.productRepository.find();
  }

  async create({ createInput }: ICreateInput) {
    const { sub_category, ...product } = createInput;
    const sub_result = await this.sub_categoryRepository.save({
      ...sub_category,
    });
    const result = await this.productRepository.save({
      ...product,
      sub_category: { ...sub_result },
    });
    return result;
  }

  async delete({ id }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  findDeleted(): Promise<Product[]> {
    return this.productRepository.find({ withDeleted: true });
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.productRepository.restore(id);
    return result.affected ? true : false;
  }
}
