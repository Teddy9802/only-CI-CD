import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateInput } from './dto/createProduct.input';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => String)
  fetchProduct(@Args('id') id: string) {
    return this.productService.findOne({ id });
  }

  @Query(() => [Product])
  fetchProducts() {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  createProduct(@Args('createInput') createInput: CreateInput) {
    return this.productService.create({ createInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('id') id: string): Promise<boolean> {
    return this.productService.delete({ id });
  }

  @Query(() => [Product])
  fetchDeleted(): Promise<Product[]> {
    return this.productService.findDeleted();
  }

  @Mutation(() => Boolean)
  restoreProduct(@Args('id') id: string): Promise<boolean> {
    return this.productService.restore(id);
  }
}
