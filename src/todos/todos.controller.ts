import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

//  npm i -D @types/multer
// npm run migration:generate src/migrations/files
// npm run build
// npm run migration:run

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getTodosById(@Param('id') id: number) {
    return this.todosService.findById(id);
  }

  @Post()
  createTodo(@Body() todo: any) {
    return this.todosService.createTodo(todo);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const todo = await this.todosService.findById(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return this.filesService.saveFile({
      name: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
      todo,
    });
  }
}
