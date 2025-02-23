import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthAccessGuard } from '@app/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../libs';
import { Paginated } from 'nestjs-paginate';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  class MockCategoriesService {
    create = jest.fn();
    findAll = jest.fn();
    findOne = jest.fn();
    update = jest.fn();
    remove = jest.fn();
  }

  class MockJwtAuthAccessGuard {
    canActivate = jest.fn().mockReturnValue(true);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useClass: MockCategoriesService,
        },
      ],
    })
      .overrideGuard(JwtAuthAccessGuard)
      .useClass(MockJwtAuthAccessGuard)
      .compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'A test category',
        image: 'image-url',
      };
      const mockCategory = {
        id: 1,
        ...createCategoryDto,
        products: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const createSpy = jest
        .spyOn(categoriesService, 'create')
        .mockResolvedValue(mockCategory);

      const result = await categoriesController.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(createSpy).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategoryPagination: Paginated<Category> = {
        data: [
          {
            id: 1,
            name: 'Category 1',
            products: [],
          },
          {
            id: 2,
            name: 'Category 2',
            products: [],
          },
        ],
        meta: {
          itemsPerPage: 10,
          totalItems: 100,
          currentPage: 1,
          totalPages: 10,
          sortBy: [['id', 'DESC']],
          searchBy: [],
          search: '',
          select: [],
        },
        links: {
          current: '',
        },
      };

      const findAllSpy = jest
        .spyOn(categoriesService, 'findAll')
        .mockResolvedValue(mockCategoryPagination);

      const result = await categoriesController.findAll({ path: '' });

      expect(result).toEqual(mockCategoryPagination);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single category by ID', async () => {
      const id = '1';
      const mockCategory = {
        id: 1,
        name: 'Test Category',
        products: [],
      };

      const findOneSpy = jest
        .spyOn(categoriesService, 'findOne')
        .mockResolvedValue(mockCategory);

      const result = await categoriesController.findOne(id);

      expect(result).toEqual(mockCategory);
      expect(findOneSpy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a category and return it', async () => {
      const id = '1';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
        description: 'A test category',
        image: 'image-url',
      };
      const mockUpdatedCategory = {
        id: 1,
        name: 'Updated Category',
        description: 'A test category',
        image: 'image-url',
        ...updateCategoryDto,
        products: [],
      };

      const updateSpy = jest
        .spyOn(categoriesService, 'update')
        .mockResolvedValue(mockUpdatedCategory);

      const result = await categoriesController.update(id, updateCategoryDto);

      expect(result).toEqual(mockUpdatedCategory);
      expect(updateSpy).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should remove a category by ID', async () => {
      const id = '1';

      const removeSpy = jest
        .spyOn(categoriesService, 'remove')
        .mockResolvedValue(undefined);

      const result = await categoriesController.remove(id);

      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledWith(1);
    });
  });
});
