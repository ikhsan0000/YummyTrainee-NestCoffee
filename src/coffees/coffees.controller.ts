import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Protocol } from 'src/common/deocrators/protocol.decorator';
// import { Public } from 'src/common/deocrators/public.decorator';
// import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from '../common/deocrators/public.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiTags('Coffees APIs')            //group endpoints to single category in swagger
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Public()
    @Get()
    async findAll(
        // @Protocol() protocol:string,
        @Query() pagiationQuery: PaginationQueryDto)
    {
        // await new Promise(resolve => setTimeout(resolve, 5000))   //timeout test purpose
        // console.log('The request proto/col is: ' + protocol);
        return this.coffeeService.findAll(pagiationQuery);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id)
    {
        return this.coffeeService.findOne(id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto)
    {
        return this.coffeeService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id, @Body() updateCoffeeDto: UpdateCoffeeDto)
    {
        return this.coffeeService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    delete(@Param('id') id)
    {
        return this.coffeeService.delete(id);
    }
}
