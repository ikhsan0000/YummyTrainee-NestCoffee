import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {

    private coffess: Coffee[] = [
        {
            id: 1,
            name: 'Cold Brew',
            brand: 'Top of the Morning',
            flavors: ['vanilla', 'chocolate']
        },
    ];

    findAll()
    {
        return this.coffess;
    }

    findOne(id: string): any
    {
        const coffee = this.coffess.find(item => item.id === +id);
        if(!coffee)
        {
            throw new NotFoundException('no such coffee here!')
        }
        return coffee;
    }

    async create(createCoffeeDto: any)
    {
        await this.coffess.push(createCoffeeDto);
        return createCoffeeDto;
    }

    update(id: string, updateCoffeeDto: any)
    {
        const existingCoffee = this.findOne(id);
        if(existingCoffee)
        {
            return existingCoffee;
        }
    }

    delete(id: string)
    {
         
    }

}
