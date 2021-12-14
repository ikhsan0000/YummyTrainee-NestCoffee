import { Test, TestingModule} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoffeesService } from "./coffees.service";
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepo = <T = any>(): MockRepo<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
});

describe('CoffeesService', () =>{
    let service: CoffeesService;
    let coffeeRepo: MockRepo;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CoffeesService,
            {provide: Connection, useValue: {} },
            {provide: getRepositoryToken(Flavor), useValue: createMockRepo()},
            {provide: getRepositoryToken(Coffee), useValue: createMockRepo()}
        ],
        }).compile();

        service = module.get<CoffeesService>(CoffeesService);
        coffeeRepo = module.get<MockRepo>(getRepositoryToken(Coffee));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        describe('when coffee with ID exist', () =>{
            it('should return the coffee object', async () => {
                const coffeeId = '1';
                const expectedCoffee = {};

                coffeeRepo.findOne.mockReturnValue(expectedCoffee);
                const coffee = await service.findOne(coffeeId);
                expect(coffee).toEqual(expectedCoffee);

            });
        });  
        describe('otherwise', () =>{
            it('should throw the "NotFoundException"',async () => {
                
            });
        });
    });
});