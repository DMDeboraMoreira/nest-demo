import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./users.entity";
import { Repository } from "typeorm";
//npm i class-validator class-transformer

@Injectable()
export class UsersDbService {

    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    ) {}

    getUsers() {
       return this.usersRepository.find();
    }

    getUserByName(name: string) {
        return this.usersRepository.findOne({where: {name}});
    }

    saveUser(user: Omit <UserEntity, 'id'>) {
        return this.usersRepository.save(user);
    }

    getUserById(id: string) {
        return this.usersRepository.findOne({where: {id}});
    }

     getUserByEmail(email: string) {
        return this.usersRepository.findOne({where: {email}});
    }


   
    
}