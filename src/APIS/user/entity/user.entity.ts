import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum GRADE_STATUS_ENUM {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
}

registerEnumType(GRADE_STATUS_ENUM, {
  name: 'GRADE_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  user_name: string;

  @Column()
  @Field(() => String)
  phone_number: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ type: 'enum', enum: GRADE_STATUS_ENUM })
  @Field(() => GRADE_STATUS_ENUM)
  grade: string;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  point: number;
}
