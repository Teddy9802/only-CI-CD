import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import {
  Payment,
  PAYMENT_TRANSACTION_STATUS_ENUM,
} from './entity/payment.entity';
import { IPaymentServiceCreate } from './interface/payment-service.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly PaymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async checkDuplicate({ impUid }) {
    const result = await this.PaymentRepository.findOne({
      where: { impUid },
    });
    if (result) throw new ConflictException('이미 결제된 아이디입니다.');
  }

  async checkAlreadyCanceled({ impUid }) {
    const payment = await this.PaymentRepository.findOne({
      where: { impUid, status: PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL },
    });
    if (payment) throw new ConflictException('이미 취소된 결제 아이디입니다.');
  }

  async checkHasCancelablePoint({ impUid, context }) {
    const payment = await this.PaymentRepository.findOne({
      where: {
        impUid,
        user: { id: context.id },
        status: PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
      },
    });
    if (!payment)
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');

    const user = await this.usersRepository.findOne({
      where: { id: context.id },
    });
    if (user.point < payment.amount)
      throw new UnprocessableEntityException('포인트가 부족합니다.');
    payment.amount;
  }

  async cancel({ impUid, amount, user }) {
    const payment = await this.create({
      impUid,
      amount: -amount,
      user,
      status: PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL,
    });
    return payment;
  }

  async create({
    impUid,
    amount,
    user,
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }: IPaymentServiceCreate): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const payment = this.PaymentRepository.create({
        impUid,
        amount,
        user,
        status,
      });
      console.log(payment);

      await queryRunner.manager.save(payment); //쿼리러너를 통해서 저장해야만 트랜잭션 먹힘

      const user1 = await queryRunner.manager.findOne(User, {
        where: { email: user.email },
      });

      const updatedUser = this.usersRepository.create({
        ...user1,
        point: user1.point + amount,
      });

      await queryRunner.manager.save(updatedUser);
      await queryRunner.commitTransaction();

      //4. 최종결과 브라우저에 돌려주기
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
