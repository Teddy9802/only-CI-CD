import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/APIS/product/entity/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Size {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  size: string;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;
}
