import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/APIS/payment/entity/payment.entity';
import { Sub_category } from 'src/APIS/sub_category/entity/sub_category.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  product_name: string;

  @Column()
  @Field(() => Int)
  like: number;

  @Column()
  @Field(() => Int)
  price: number;

  @ManyToOne(() => Sub_category)
  @Field(() => Sub_category)
  sub_category: Sub_category;

  @JoinColumn()
  @Field(() => Payment)
  @OneToOne(() => Payment)
  payment: Payment;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
