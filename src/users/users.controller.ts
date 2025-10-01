import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, Res, Headers, UseGuards, UseInterceptors, ParseUUIDPipe, HttpException, HttpStatus, NotFoundException, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import  express from "express";
//import type { UserInterface } from "./user.interface";
import { AuthGuard } from "../guards/auth.guard";
import { DateAdderInterceptor } from "../interceptors/date-adder.interceptor";
import { UsersDbService } from "./usersDb.service";
//import { UserEntity } from "./users.entity";
import { CreateUserDto } from "./dtos/CreateUser.dto";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Max } from "class-validator";
import { MinSizeValidatorPipe } from "../pipes/min-size-validator.pipe";
import { AuthService } from "./auth.service";
import { UserCredentialsDto } from "./dtos/UserCredentials.dto";
import { Role } from "../roles.enum";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

// npm run migration:generate src/migrations/add_admin
// npm run build
// npm run migration:run

@ApiTags('users')
@Controller('users')
// @UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersDbService: UsersDbService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly authService: AuthService
    ) {}

    @Get()
    getUsers(@Query('name') name?: string) {
        if (name) {
            return this.usersDbService.getUserByName(name);
        }
        return this.usersDbService.getUsers();
    } 

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    getUserProfile(/*@Headers('token') token?: string*/ @Req() request: express.Request & {user: any}) {
        // if (token !== '1234') {
        //     return 'sin acceso';
        // }
        console.log(request.user);
        return 'este endpoint es para obtener el perfil de un usuario';
    }
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDUzZDU2Mi1mMDY5LTRjZWItYjU0YS1mZjJhNTBjYzMxNzEiLCJpZCI6IjgwNTNkNTYyLWYwNjktNGNlYi1iNTRhLWZmMmE1MGNjMzE3MSIsImVtYWlsIjoiYWxlQG1haWwuY29tIiwiaWF0IjoxNzU3Njg2NTQ5LCJleHAiOjE3NTc2OTAxNDl9.4Wn1I1bV9uNBznE_WcKCYBZc0loWCbO1eacnDYnecAE

    @Post('profile/images')
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new MinSizeValidatorPipe())   
    @UseGuards(AuthGuard)
    getUserImages(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 100000,
                    message: 'El archivo debe ser menor a 100kb',
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp)$/,
                })  
            ]
        })
    ) file: Express.Multer.File) {
       // return this.cloudinaryService.uploadImage(file);
       return file
    } 

    //@HttpCode(418)
    @Get('coffee')
    getCoffee() {
        try {
           throw new Error();

        } catch (error) {
           throw new HttpException(
            {
                status: HttpStatus.I_AM_A_TEAPOT,
                error: 'envio de cafe fallido',
            },
            HttpStatus.I_AM_A_TEAPOT
           )
        }
    }

    @Get('message')
    getMessage(@Res() response: express.Response) {
        response.status(200).send('este endpoint es para obtener un mensaje');
    }

    @Get('request')
    getRequest(@Req() request: express.Request) {
       console.log(request);
       return 'este endpoint loguea un request';
    }

    @Get('admin')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getAdmin() {
        return 'ruta protegida';
    }

    @Get('auth0/protected')
    getAuth0Protected(@Req() req: express.Request) {
        console.log(req.oidc.user); // no es jwt
        return JSON.stringify(req.oidc.user);
    }

//     Estas ejecutando un metodo: GET en la ruta /auth0/protected
// {
//   sid: 'tXMA8EgldZ5D5x3-h5nTwxi_79xlfgBt',
//   given_name: 'Débora',
//   family_name: 'Moreira',
//   nickname: 'debomoreira243',
//   name: 'Débora Moreira',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIjGbNAsjgRhRQyAroiofqe84_yQ2R4ErJ0eXZmSdXFZP8fbP8=s96-c',
//   updated_at: '2025-09-15T15:03:22.545Z',
//   email: 'debomoreira243@gmail.com',
//   email_verified: true,
//   sub: 'google-oauth2|115009700513414274919'
// }

    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        console.log(id);
        const user = await this.usersDbService.getUserById(id);
        if (!user) {
            throw new NotFoundException('usuario no encontrado');
        }
        return user;
    }
    
    
    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
    createUser(
        @Body() user: CreateUserDto,
        @Req() request: express.Request & {now: string}
    ) {
   
        return this.authService.signUp({
            ...user, 
            createdAt: request.now,
            //isAdmin: user.isAdmin ?? false, // 👈 fuerza false si no viene 

        });
    }

    @Post('signin')
    async signIn(
        @Body() user: UserCredentialsDto) {
        return this.authService.signIn(user.email, user.password);
    }

    @Put()
    updateUser() {
        return 'este endpoint es para actualizar un usuario';
    }

    @Delete()
    deleteUser() {
        return 'este endpoint es para eliminar un usuario';
    } 
    
 
}

