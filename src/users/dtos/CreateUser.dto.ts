import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Min, MinLength, IsEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'El nombre del usuario debe tener minimo 3 caracteres',
        example: 'Fabrizio'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'El email del usuario debe ser un email valido',
        example: 'fabrizio@gmail.com'
    })
    email: string;

    /**
     * La contraseña debe ser dificil de encontrar
     * @example 'Strong!(Password'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    // @ApiProperty({
    //     description: 'La contraseña debe ser dificil de encontrar',
    //     example: 'Strong!(Password'
    // })
    password: string

    @IsEmpty()
    @ApiProperty({
        description: 'Asignada por default al momento de crear el usuario no debe ser incluida en el body',
        default: false
    })
    isAdmin: boolean
   
}

//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0OTMyNmRjYy0zMGMxLTQyOGEtODczYy0wOWQyMzFhZDc4YjAiLCJpZCI6IjQ5MzI2ZGNjLTMwYzEtNDI4YS04NzNjLTA5ZDIzMWFkNzhiMCIsImVtYWlsIjoiZmFicml6QGdtYWlsLmNvbSIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzU4NzIxNDA3LCJleHAiOjE3NTg3MjUwMDd9.TaiRUqWFywZs4Vb_ArDg9NaYa8ZkUGjOY7lxRsii6Kg"