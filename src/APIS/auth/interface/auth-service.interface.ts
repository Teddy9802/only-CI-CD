import { Response } from 'express';
import { User } from 'src/APIS/user/entity/user.entity';
import { IAuthUserItem } from 'src/COMMONS/types/context';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUserItem;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}
