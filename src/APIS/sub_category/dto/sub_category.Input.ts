import { Field, InputType } from '@nestjs/graphql';
import { Main_categoryInput } from 'src/APIS/main_category/dto/main_category.input';

@InputType()
export class Sub_categoryInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sub_category_name: string;

  @Field(() => Main_categoryInput)
  main_category: Main_categoryInput;
}
