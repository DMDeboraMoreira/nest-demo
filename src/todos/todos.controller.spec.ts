import { Test, TestingModule } from "@nestjs/testing"
import { TodosController } from "./todos.controller"
import { TodosService } from "./todos.service"
import { FilesService } from "./files.service"
import { TodoEntity } from "./todos.entity"
import { Readable } from "stream"

describe ('todosController', () => {

    let todosController: TodosController 

    let mockTodosService: Partial<TodosService> 

    let mockFilesService: Partial<FilesService> 

    const mockTodo: Partial <TodoEntity> = {
        title: 'Todo 1',
        description: 'Description 1',

    }

    const mockFile: Express.Multer.File = {
        fieldname: "example",
        originalname: "example.txt",
        encoding: "utf-8",
        mimetype: "text/plain",
        size: 0,
        stream: new Readable(),
        destination: "",
        filename: "",
        path: "",
        buffer: Buffer.from([])
    };
        

    beforeEach(async() => {

        mockTodosService = {
            getTodos: () => Promise.resolve([{...mockTodo, id:1, isCompleted: false} as TodoEntity]),
            findById: (id: number) => Promise.resolve({...mockTodo, id:1, isCompleted: false} as TodoEntity),
            createTodo: (todo: Partial <TodoEntity>) => Promise.resolve({...mockTodo, id:1, isCompleted: false} as TodoEntity),
           
        }

        mockFilesService = {
            saveFile: () => Promise.resolve({
                id: 1,
                filename: "example.txt",
                mimetype: "text/plain",
                data: Buffer.from([]),
                todo: {...mockTodo, id:1, isCompleted: false} as TodoEntity
            })
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [
                {provide: TodosService, useValue: mockTodosService}, 
                {provide: FilesService, useValue: mockFilesService},
            ],
        }).compile()

        todosController = module.get<TodosController>(TodosController);
    })

    it('should be defined', () => {
        expect(todosController).toBeDefined();
    })

    it('getTodos() should return an array of todos', async () => {
        const todos = await todosController.getTodos()

        expect(todos).toEqual([
            {
                id: 1,
                title: 'Todo 1',
                description: 'Description 1',
                isCompleted: false
            }
        ])
    })

    it ('createTodo() should create a new todo', async () => {
        const todo = await todosController.createTodo(mockTodo)

        expect(todo).toEqual({
            id: 1,
            title: 'Todo 1',
            description: 'Description 1',
            isCompleted: false
        })
    })
    
    it ('uploadFile() should upload a file', async () => {
        const file = await todosController.uploadFile(1, mockFile) 

        expect(file).toEqual({
            id: 1,
            filename: "example.txt",
            mimetype: "text/plain",
            data: Buffer.from([]),
            todo: {...mockTodo, id:1, isCompleted: false} 
            
        })
    })

})