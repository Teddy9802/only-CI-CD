import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/COMMONS/auth/gql-auth.guard';
import { IContext } from 'src/COMMONS/types/context';
import { IamportService } from '../iamport/iamport.service';
import {
  Payment,
  PAYMENT_TRANSACTION_STATUS_ENUM,
} from './entity/payment.entity';
import { PaymentService } from './payments.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<Payment> {
    const user = context.req.user;
    const token = await this.iamportService.getToken();

    await this.iamportService.checkPaid({ impUid, amount, token });

    await this.paymentService.checkDuplicate({ impUid });

    return this.paymentService.create({
      impUid,
      amount,
      user,
      status: PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPoint(
    @Args('impUid') impUid: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user;
    //검증로직들
    //1.이미 취소된 건인지 확인
    await this.paymentService.checkAlreadyCanceled({ impUid });

    //2.취소하기에 충분한 내 포인트 잔액이 남아있는지
    await this.paymentService.checkHasCancelablePoint({
      impUid,
      context,
    });

    //3.실제로 아임포트에 취소요청하기
    const token = this.iamportService.getToken();
    const canceledAmount = this.iamportService.cancel({ impUid, token });

    //4.pointTransaction 테이블에 결제 취소 등록하기
    return await this.paymentService.cancel({
      impUid,
      amount: canceledAmount,
      user,
    });
  }
}
