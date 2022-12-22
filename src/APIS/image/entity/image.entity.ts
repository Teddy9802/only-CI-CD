import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/APIS/product/entity/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  image_id: string;

  @Field(() => String)
  @Column()
  image_url: string;

  @Field(() => Boolean)
  @Column()
  is_main: boolean;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;
}
