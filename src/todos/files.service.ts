import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./files.entity";
import { Repository } from "typeorm";
import { TodoEntity } from "./todos.entity";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File) 
        private readonly filesRepository: Repository<File>,
    ) {}

    async saveFile(
        {name, mimetype, data, todo}: {
            name: string, 
            mimetype: string, 
            data: Buffer, 
            todo: TodoEntity
        }) {
            const file = new File()
            file.filename = name
            file.mimetype = mimetype
            file.data = data
            file.todo = todo
            
            return this.filesRepository.save(file)
        }
}