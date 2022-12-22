import { Field, ObjectType } from '@nestjs/graphql';
import { Main_category } from 'src/APIS/main_category/entity/main_category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Sub_category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  sub_category_name: string;

  @ManyToOne(() => Main_category)
  @Field(() => Main_category)
  main_category: Main_category;
}
