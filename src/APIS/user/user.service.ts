import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import {
  ICreateUserInput,
  IUserServiceDelete,
} from './interface/user-service.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInput }: ICreateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (user) throw new ConflictException('이미 가입된 계정입니다.');
    const { ...User } = createUserInput;
    const result = await this.userRepository.save({
      ...User,
    });
    return result;
  }

  async delete({ id }: IUserServiceDelete): Promise<boolean> {
    const result = await this.userRepository.softDelete({
      id,
    });
    return result.affected ? true : false;
  }

  findDelete(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: true });
  }

  update({ user, updateUserInput }): Promise<User> {
    const result = this.userRepository.save({
      ...user,
      ...updateUserInput,
    });
    return result;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.userRepository.restore({
      id,
    });
    return result.affected ? true : false;
  }

  findLogin({ context }) {
    return this.userRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
  }

  async loginUpdate({ user, hashedPassword: password }) {
    const result = await this.userRepository.save({
      ...user,
      password,
    });
    return result ? true : false;
  }

  async deleteLogin({ context }) {
    const result = await this.userRepository.softDelete({
      id: context.req.user.id,
    });
    return result.affected ? true : false;
  }
}
