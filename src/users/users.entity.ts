import { Column, Entity, PrimaryGeneratedColumn,  } from "typeorm";
import { v4 as uuid } from 'uuid';
//npm install uuid

@Entity({
    name: 'users'
})
export class UserEntity {
    
    @PrimaryGeneratedColumn('uuid') 
    id: string= uuid();

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column()
    createdAt: string;
}