import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entity/user.entity';

export interface ICreateUserInput {
  createUserInput: CreateUserInput;
}

export interface IUserServiceDelete {
  id: string;
}

export interface IUserServiceUpdate {
  user: User;
  updateUserInput: UpdateUserInput;
}
