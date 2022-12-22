import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/COMMONS/types/context';
import { GqlAuthAccessGuard } from 'src/COMMONS/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;

    return this.userService.create({ createUserInput });
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.userService.delete({ id });
  }

  @Query(() => [User])
  fetchDeleted(): Promise<User[]> {
    return this.userService.findDelete();
  }

  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('UpdateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    return this.userService.update({ user, updateUserInput });
  }

  @Mutation(() => Boolean)
  restoreUser(@Args('id') id: string): Promise<boolean> {
    return this.userService.restore(id);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.userService.findLogin({ context });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async updateLoginUser(
    @Context() context: IContext,
    @Args('password') password: string,
  ) {
    console.log(context.req.user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
    return this.userService.loginUpdate({ user, hashedPassword });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(@Context() context: IContext) {
    return this.userService.deleteLogin({ context });
  }
}
