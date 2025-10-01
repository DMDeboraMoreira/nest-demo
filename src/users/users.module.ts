import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users.entity";
import { UsersDbService } from "./usersDb.service";
import { CloudinaryService } from "./cloudinary.service";
import { Cloudinary } from "../config/cloudinary"; 
import { AuthService } from "./auth.service";
import { requiresAuth } from "express-openid-connect";


// const mockUserService = {
//     getUsers: () => "esto es un servicio mock de usuarios"};

//migrations
// npm run migration:generate src/migrations/add_password
// npm run build
// npm run migration:run

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
        // {
        //     provide: UsersService, 
        //     useValue: mockUserService
        // },
        UsersService,
        UsersDbService,
        UsersRepository,
        CloudinaryService,
        Cloudinary,
        AuthService,
        {
            provide: 'API_USERS',
            useFactory: async () => {
                const apiUsers = await fetch('https://jsonplaceholder.typicode.com/users')
                .then(res => res.json());
                return apiUsers.map((user) => {
                    return {
                        id: user.id, 
                        name: user.name, 
                        email: user.email
                    };
                });
            }
        }
    ],
    controllers: [UsersController],
    exports: []
})
export class UsersModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('users');
        consumer.apply(requiresAuth()).forRoutes('users/auth0/protected');
    }
}