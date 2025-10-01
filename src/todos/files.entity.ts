import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TodoEntity } from "./todos.entity";

@Entity({name: 'files'})
export class File {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    filename: string

    @Column()
    mimetype: string

    @Column({type: 'bytea'})
    data: Buffer
    
    @ManyToOne(() => TodoEntity, (todo) => todo.files)
    @JoinColumn({name: 'todo_id'})
    todo: TodoEntity 
}