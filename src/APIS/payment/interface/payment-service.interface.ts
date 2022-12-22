import { IAuthUser } from 'src/COMMONS/types/context';

export interface IPaymentServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
  status: string;
}
