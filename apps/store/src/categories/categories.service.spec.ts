import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from '../libs';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: CategoriesRepository;

  class MockCategoriesRepository {
    create = jest.fn();
    findOneNoCheck = jest.fn();
    findOne = jest.fn();
    findOneAndUpdate = jest.fn();
    find = jest.fn();
    findBy = jest.fn();
    findOneAndDelete = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useClass: MockCategoriesRepository,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Category 1' };
      const category = new Category(createCategoryDto);

      const createSpy = jest
        .spyOn(categoriesRepository, 'create')
        .mockResolvedValue(category);

      const result = await categoriesService.create(createCategoryDto);

      expect(result).toEqual(category);
      expect(createSpy).toHaveBeenCalledWith(new Category(createCategoryDto));
      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });

  // describe('findAll', () => {
  //   it('should retrun an array of categories', async () => {
  //     const categories = [
  //       new Category({ name: 'Category 1' }),
  //       new Category({ name: 'Category 2' }),
  //     ];

  //     const findSpy = jest
  //       .spyOn(categoriesRepository, 'find')
  //       .mockResolvedValue(categories);

  //     const result = await categoriesService.findAll({ path: '' });

  //     expect(result).toEqual(categories);
  //     expect(findSpy).toHaveBeenCalled();
  //     expect(findSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const getCategoryDto: GetCategoryDto = { id: 1 };
      const category = new Category({ name: 'Category 1' });

      const findOneSpy = jest
        .spyOn(categoriesRepository, 'findOne')
        .mockResolvedValue(category);

      const result = await categoriesService.findOne(getCategoryDto);

      expect(result).toEqual(category);
      expect(findOneSpy).toHaveBeenCalledWith(getCategoryDto);
    });
  });

  describe('update', () => {
    it('should update and return the updated category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const updatedCategory = new Category({ ...updateCategoryDto, id: 1 });

      const findOneAndUpdateSpy = jest
        .spyOn(categoriesRepository, 'findOneAndUpdate')
        .mockResolvedValue(updatedCategory);

      const result = await categoriesService.update(1, updateCategoryDto);

      expect(result).toEqual(updatedCategory);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { id: 1 },
        { ...updateCategoryDto },
      );
    });
  });

  describe('remove', () => {
    it('should remove a category and return it', async () => {
      const findOneAndDeleteSpy = jest
        .spyOn(categoriesRepository, 'findOneAndDelete')
        .mockResolvedValue(undefined);

      const result = await categoriesService.remove(1);

      expect(result).toBeUndefined();
      expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id: 1 });
      expect(findOneAndDeleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
