import { IsNotEmpty, IsString } from "class-validator";

export class CreateCoffeeDto {
    
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly brand: string;
    
    @IsString({each: true})
    @IsNotEmpty()
    readonly flavors: string[];
}
