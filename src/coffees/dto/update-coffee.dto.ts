import { PartialType } from "@nestjs/swagger";
import { CreateCoffeeDto } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto)
{}
//using PartialType, it automatically use all the field on the argument classRef and adding "?" on each field to make it optional
