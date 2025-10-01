import { Module } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { TodosController } from "./todos.controller";
import { TodosRepository } from "./todos.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "./todos.entity";
import { File } from "./files.entity";
import { FilesService } from "./files.service";

const ACCESS= 'ESTA ES MI CLAVE SECRETA DE ACCESO';
@Module({
    imports: [TypeOrmModule.forFeature([TodoEntity, File])],
    providers: [
        TodosService, 
        FilesService,
        TodosRepository,
        { 
            provide: 'ACCESS_TOKEN', 
            useValue: ACCESS },
    ],
    controllers: [TodosController],
    exports: []
})
export class TodosModule {}