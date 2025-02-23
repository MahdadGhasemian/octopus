import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsService } from '../products/products.service';
import { Category, Order, OrderItem, Product, User } from '../libs';
import { OrderStatus } from '@app/common';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let productsService: ProductsService;
  let ordersRepository: OrdersRepository;

  class MockRepositoryClass {
    create = jest.fn();
    findOneNoCheck = jest.fn();
    findOne = jest.fn();
    findOneAndUpdate = jest.fn();
    find = jest.fn();
    findBy = jest.fn();
    findOneAndDelete = jest.fn();
  }

  class MockProductsService {
    findOne = jest.fn();
  }

  jest.mock('nestjs-paginate', () => ({
    paginate: jest.fn().mockResolvedValue({
      data: [mockOrder],
      meta: { total: 1, currentPage: 1, perPage: 10 },
    }),
  }));

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    orders: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Product 1',
    category_id: 1,
    price: 20,
    sale_price: 20,
    is_active: true,
    category: {} as Category,
    order_items: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockOrderItem = new OrderItem({
    product: new Product(mockProduct),
    quantity: 1,
  });

  const mockOrder = {
    id: 1,
    user_id: mockUser.id,
    user: mockUser,
    order_date: new Date(),
    total_bill_amount: 20,
    order_status: OrderStatus.PENDING,
    order_items: [mockOrderItem],
    payments: [],
    is_paid: false,
    note: 'Note 1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const createOrderDto: CreateOrderDto = {
    order_date: new Date(),
    order_items: [
      {
        product_id: 1,
        quantity: 1,
      },
    ],
    note: 'Note 1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: ProductsService,
          useClass: MockProductsService,
        },
        {
          provide: OrdersRepository,
          useClass: MockRepositoryClass,
        },
        {
          provide: OrderItemsRepository,
          useClass: MockRepositoryClass,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an order', async () => {
      jest.spyOn(ordersRepository, 'create').mockResolvedValue(mockOrder);
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder);
      jest.spyOn(productsService, 'findOne').mockResolvedValue(mockProduct);

      const result = await ordersService.create(createOrderDto, mockUser);

      expect(result).toEqual(mockOrder);
      expect(ordersRepository.create).toHaveBeenCalledWith(expect.any(Order));
      expect(ordersRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  // describe('findAll', () => {
  //   it('should return an array of orders', async () => {
  //     // jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrder);

  //     const result = await ordersService.findAll({ path: '' }, mockUser);

  //     expect(result).toEqual([mockOrder]);
  //     expect(ordersRepository.find).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('findOne', () => {
    it('should return a single order', async () => {
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder);

      const result = await ordersService.findOne({ id: 1 }, mockUser);

      expect(result).toEqual(mockOrder);
      expect(ordersRepository.findOne).toHaveBeenCalledWith(
        { id: 1, user_id: mockUser.id },
        {
          order_items: {
            product: {
              category: true,
            },
          },
        },
      );
    });
  });

  describe('update', () => {
    it('should update and return the updated order', async () => {
      const updatedOrder = {
        ...mockOrder,
        note: 'Note 1',
      };

      jest
        .spyOn(ordersRepository, 'findOneAndUpdate')
        .mockResolvedValue(updatedOrder);
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder);
      jest.spyOn(productsService, 'findOne').mockResolvedValue(mockProduct);

      const result = await ordersService.update(
        { id: mockOrder.id },
        {
          note: 'Note 1',
          order_items: createOrderDto.order_items,
        },
        mockUser,
      );

      expect(result).toEqual(updatedOrder);
      expect(ordersRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { id: mockOrder.id, user_id: mockUser.id },
        {
          note: 'Note 1',
          order_items: createOrderDto.order_items,
          total_bill_amount: 20,
        },
      );
    });
  });

  describe('remove', () => {
    it('should remove an order and return it', async () => {
      jest
        .spyOn(ordersRepository, 'findOneAndDelete')
        .mockResolvedValue(undefined);
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder);

      const result = await ordersService.remove({ id: mockOrder.id }, mockUser);

      expect(result).toBeUndefined();
      expect(ordersRepository.findOneAndDelete).toHaveBeenCalledWith({
        id: mockOrder.id,
        user_id: mockUser.id,
      });
    });
  });
});
