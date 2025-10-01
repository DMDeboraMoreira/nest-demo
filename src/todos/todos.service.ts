import { Inject, Injectable } from "@nestjs/common";
import { TodosRepository } from "./todos.repository";
import { TodoEntity } from "./todos.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TodosService {

    constructor(
        private todosRepository: TodosRepository, 
        @Inject('ACCESS_TOKEN') private accessToken: string,
        @InjectRepository(TodoEntity) 
        private todosDbRepository: Repository<TodoEntity>, 
    ) {}

    // getTodos() {
    //     return this.accessToken === 'ESTA ES MI CLAVE SECRETA DE ACCESO' ? 
    //     this.todosRepository.getTodos() 
    //     : 'No tienes acceso a esta información';
    // }

    getTodos() {
        return this.todosDbRepository.find({
            relations: ['files']
        });
    }

    findById(id: number) {
        return this.todosDbRepository.findOne({where: {id}, relations: ['files']});
    }

    createTodo(todo: Omit <TodoEntity, 'id'>) {
        return this.todosDbRepository.save(todo);
    }
}