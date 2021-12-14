import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
// import { Event } from 'src/events/entities/event.entity';
import { Event } from '../events/entities/event.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(coffeesConfig.KEY)          //settings needed to identify keypairs available in coffees.config
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
        private readonly configService: ConfigService,
        ){
            // const databaseHost = this.configService.get<string>('DATABASE_NAME');   //get data from app config
            // const coffeeConst = coffeesConfiguration.coffeeConstant;                              //get data from coffees.config file using keypair 
            // console.log(databaseHost);
            // console.log(coffeeConst);
        }

    findAll(paginationQuery: PaginationQueryDto)
    {
        const { limit, offset } = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit
        });
    }
    createFlavor(name: string)
    {
        return this.flavorRepository.create({ name })
    }

    async findOne(id: string)
    {
        const coffee = await this.coffeeRepository.findOne(id,{
            relations: ['flavors']
        });
        if(!coffee)
        {
            throw new NotFoundException('no such coffee here!')
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto)
    {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors});
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto)
    {
        const flavors = 
            updateCoffeeDto.flavors &&
            (await Promise.all(
               updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)) 
            ));
        

        const existingCoffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });
        if(!existingCoffee)
        {
            throw new NotFoundException ('no such coffee with that id');
        }
        else
        {
            return this.coffeeRepository.save(existingCoffee);
        }
    }

    async delete(id: string)
    {
         const coffee = await this.findOne(id);
         return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>
    {
        const existingFlavor = await this.flavorRepository.findOne({ name })
        if (existingFlavor)
        {
            return existingFlavor;
        }
        else
        {
            return this.flavorRepository.create({ name })
        }
    }

    async reccomendCoffee(coffee: Coffee)
    {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try
        {
            coffee.recommendations++;

            const recommendEvent = new Event()
            recommendEvent.name = 'recommended_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        }
        catch (err)
        {
            await queryRunner.rollbackTransaction();
        }
        finally
        {
            await queryRunner.release();
        }
    }

}
