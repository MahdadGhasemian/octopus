import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthAccessGuard, OrderStatus } from '@app/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem, Product, User } from '../libs';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  class MockOrdersService {
    create = jest.fn();
    findAll = jest.fn();
    findOne = jest.fn();
    update = jest.fn();
    remove = jest.fn();
    clearItems = jest.fn();
    cancelOrder = jest.fn();
  }

  class MockJwtAuthAccessGuard {
    canActivate = jest.fn().mockReturnValue(true);
  }

  const user: User = {
    id: 1,
    email: 'user@example.com',
  };

  const mockOrderItem = new OrderItem({
    product: new Product({ id: 1 }),
    quantity: 1,
  });

  const mockOrder = {
    id: 1,
    order_date: new Date(),
    total_bill_amount: 1,
    order_status: OrderStatus.PENDING,
    user_id: user.id,
    order_items: [mockOrderItem],
    payments: [],
    is_paid: false,
    note: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useClass: MockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthAccessGuard)
      .useClass(MockJwtAuthAccessGuard)
      .compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a order', async () => {
      const createOrderDto: CreateOrderDto = {
        order_date: new Date(),
        order_items: [
          {
            product_id: 1,
            quantity: 1,
          },
        ],
      };

      const createSpy = jest
        .spyOn(ordersService, 'create')
        .mockResolvedValue(mockOrder);

      const result = await ordersController.create(user, createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(createSpy).toHaveBeenCalledWith(createOrderDto, user);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [mockOrder];

      const findAllSpy = jest
        .spyOn(ordersService, 'findAll')
        .mockResolvedValue(mockOrders);

      const result = await ordersController.findAll(user);

      expect(result).toEqual(mockOrders);
      expect(findAllSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const findOneSpy = jest
        .spyOn(ordersService, 'findOne')
        .mockResolvedValue(mockOrder);

      const result = await ordersController.findOne(user, '1');

      expect(result).toEqual(mockOrder);
      expect(findOneSpy).toHaveBeenCalledWith({ id: 1 }, user);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = { note: '' };

      const updateSpy = jest
        .spyOn(ordersService, 'update')
        .mockResolvedValue(mockOrder);

      const result = await ordersController.update(user, '1', updateOrderDto);

      expect(result).toEqual(mockOrder);
      expect(updateSpy).toHaveBeenCalledWith({ id: 1 }, updateOrderDto, user);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const removeSpy = jest
        .spyOn(ordersService, 'remove')
        .mockResolvedValue(undefined);

      const result = await ordersController.remove(user, '1');
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledWith({ id: 1 }, user);
    });
  });

  describe('clearOrderItems', () => {
    it('should clear the items of an order', async () => {
      const clearItemsSpy = jest
        .spyOn(ordersService, 'clearItems')
        .mockResolvedValue(undefined);

      const result = await ordersController.clearOrderItems(user, '1');

      expect(result).toBeUndefined();
      expect(clearItemsSpy).toHaveBeenCalledWith({ id: 1 }, user);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const mockCancelledOrder = {
        ...mockOrder,
        status: OrderStatus.CANCELLED,
      };

      const cancelOrderSpy = jest
        .spyOn(ordersService, 'cancelOrder')
        .mockResolvedValue(mockCancelledOrder);

      const result = await ordersController.cancelOrder(user, '1');

      expect(result).toEqual(mockCancelledOrder);
      expect(cancelOrderSpy).toHaveBeenCalledWith({ id: 1 }, user);
    });
  });
});
