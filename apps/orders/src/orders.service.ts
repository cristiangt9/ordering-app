import { Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(request: CreateOrderRequestDto) {
    return this.ordersRepository.create(request);
  }

  async getOrders(request: CreateOrderRequestDto) {
    return this.ordersRepository.find({});
  }
}
