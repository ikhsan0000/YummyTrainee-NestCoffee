import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from 'supertest';
import { CoffeesModule } from "../../src/coffees/coffees.module";
import { CreateCoffeeDto } from "../../src/coffees/dto/create-coffee.dto";

describe('[Feature] Coffeess - /coffees', () =>{
  
  const coffeeEx = {
    name: "Not so Original",
    brand: "NestCaffe",
    flavors: ["Capuchino, Chocolate"]
  }
  let app: INestApplication;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule,
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 2021,
        username: 'root',
        password: '',
        database: 'nest_coffee_mock',
        autoLoadEntities: true,
        synchronize: true,
      })],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(
      {
        whitelist: true,        //strip out all unneccessary payload outside the dto fromat from POSTed body 
        transform: true,        //transform returned payload to the correct instance from their own respective dto
        forbidNonWhitelisted: true,    //if detected any unneccessary payload field inside body, will throws an error
        transformOptions:
        {
          enableImplicitConversion: true,   //quesry parameter changed automatically their own respective type
        },
      }
    ));
    await app.init();
  });

   it('Create [POST /]', () =>{

    return request(app.getHttpServer())
    .post('/coffees')
    .send(coffeeEx as CreateCoffeeDto)
    .expect(HttpStatus.CREATED);

   });
   
   it.todo('Get all [GET /]');
   it.todo('Get One [GET /:id]');
   it.todo('Update One [PATCH /:id]');
   it.todo('DELETE [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
})