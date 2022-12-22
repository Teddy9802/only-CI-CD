import { Field, InputType, Int } from '@nestjs/graphql';
import { Sub_categoryInput } from 'src/APIS/sub_category/dto/sub_category.Input';

@InputType()
export class CreateInput {
  @Field(() => String)
  product_name: string;

  @Field(() => Int)
  like: number;

  @Field(() => Int)
  price: number;

  @Field(() => Sub_categoryInput)
  sub_category: Sub_categoryInput;
}
