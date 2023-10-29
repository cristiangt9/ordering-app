import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrdersRepository } from './orders.repository';
import { ClientProxy } from '@nestjs/microservices';
import { BILLING_SERVICE } from './constants/services';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async createOrder(request: CreateOrderRequestDto, authentication: string) {
    this.logger.log(request);
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      this.logger.error(err);
      throw err;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
