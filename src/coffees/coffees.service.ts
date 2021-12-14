import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(Event.name) private readonly eventModel: Model<Event>
    ){}

    async findAll(paginationQuery: PaginationQueryDto)
    {
        const { limit, offset } = paginationQuery;
        return this.coffeeModel
        .find()
        .skip(offset)
        .limit(limit)
        .exec();
    }

    async findOne(id: string): Promise<any>
    {
        const coffee = this.coffeeModel.findById({_id: id}).exec();
        if(!coffee)
        {
            throw new NotFoundException('no such coffee here!');
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto)
    {
        const coffee = new this.coffeeModel(createCoffeeDto);
        return coffee.save();
    }

    async update(id: string, updateCoffeeDto: any)
    {
        const existingCoffee = await this.coffeeModel
        .findOneAndUpdate({_id: id}, {$set: updateCoffeeDto}, {new: true})
        .exec();

        if(!existingCoffee)
        {
            throw new NotFoundException(`Coffee with the id of ${id} is not found`);
        }
        return existingCoffee;
    }

    async delete(id: string)
    {
         const deleteCoffee = await this.coffeeModel.findOneAndDelete({_id: id}).exec();
        if(!deleteCoffee)
        {
            throw new NotFoundException();
        }
        return deleteCoffee;
    }

    async recommendationCoffee(coffee: Coffee)
    {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            coffee.recommendations++;

            const reccomendEvent = new this.eventModel({
                name: 'recommend_coffee',
                type: 'coffee',
                payload: { coffeeId: coffee.id }
            });
            await reccomendEvent.save({session});
            await coffee.save({session});

            await session.commitTransaction();
            
        } catch (error) {
            await session.abortTransaction();
        }
        finally {
            session.endSession();
        }
    }

}
