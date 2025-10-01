import { Inject, Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UserInterface } from "./user.interface";

@Injectable()
export class UsersService {
   
    constructor(private usersRepository: UsersRepository,
        @Inject('API_USERS') private apiUsers: UserInterface[],
    ) {}
    async getUsers() {
        const dbUsers= await this.usersRepository.getUsers();
        const users=[...dbUsers, ...this.apiUsers];
        return users
    }

     getUserById(id: number) {
        return this.usersRepository.getUserById(id);
    }
     getUserByName(name: string) {
        return this.usersRepository.getUserByName(name);
    }
   
    createUser(user: Omit <UserInterface, 'id'>): Promise<UserInterface> {
        return this.usersRepository.createUser(user);
    }

}    