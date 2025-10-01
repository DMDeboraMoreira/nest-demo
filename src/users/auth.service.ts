import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersDbService } from "./usersDb.service";
import { UserEntity } from "./users.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../roles.enum";
// npm i bcrypt

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersDbService,
        private readonly jwtService: JwtService
    
    ) {}

    async signUp(user: Omit <UserEntity, 'id'>) {
        const dbUser = await this.usersService.getUserByEmail(user.email);
        if (dbUser) {
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        if (!hashedPassword) {
            throw new BadRequestException('Error al hashear la contraseña');
        }
        return this.usersService.saveUser({...user, password: hashedPassword});
       
    }

    async signIn(email: string, password: string) {
        const dbUser = await this.usersService.getUserByEmail(email);
        if (!dbUser) {
            throw new BadRequestException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        const userPayload = {
            sub: dbUser.id,
            id: dbUser.id,
            email: dbUser.email,
            //isAdmin: dbUser.isAdmin
            roles: [dbUser.isAdmin ? Role.ADMIN : Role.USER]
        };

        const token = this.jwtService.sign(userPayload);

        return {success: "User logged in successfully", token};
      
    }

   
}