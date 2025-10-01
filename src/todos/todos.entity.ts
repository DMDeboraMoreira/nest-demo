import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./files.entity";


@Entity({
    name: 'todos'
})
export class TodoEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    completed: boolean;

    @OneToMany(() => File, (file) => file.todo)
    files: File[];
}