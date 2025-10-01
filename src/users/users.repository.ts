import { Injectable } from "@nestjs/common";
import e from "express";
import { UserInterface } from "./user.interface";

@Injectable()
export class UsersRepository {
    private users: UserInterface[] = [
        {
            id: 0,
            name: "pepe",
            email: "pepe@mail.com"
        },
        {
            id: 1,
            name: "tota",
            email: "tota@mail.com"
        },
        {
            id: 2,
            name: "gama",
            email: "gama@mail.com"
        }
    ];
    async getUsers() {
        return this.users;
    }   

     async getUserById(id: number) {
       return this.users.find(user => user.id === id);
    }
      async getUserByName(name: string) {
        return this.users.find(user => user.name === name);
    }

async createUser(user: Omit <UserInterface, 'id'>) {
        const id = this.users.length + 1;
        this.users=[...this.users, {id,...user}];
        return {id,...user};
    }
}