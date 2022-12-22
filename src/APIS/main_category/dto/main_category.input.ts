import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Main_categoryInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  brand: string;
}
