import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { JwtService } from "@nestjs/jwt"
import { UsersDbService } from "./usersDb.service"
import { UserEntity } from "./users.entity"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

// npm run test 

describe('authService', () => {

    let authService: AuthService

    let mockUserService : Partial<UsersDbService> 

    const mockUser: Omit <UserEntity, 'id'> = {
     name: 'fabri',
     createdAt: '2025-05-05',
     password: '1234',
     email: 'fabri@mail.com',
     isAdmin: false
    }

    beforeEach(async() => {

    mockUserService = {
        getUserByEmail: ()=> Promise.resolve(null),
        saveUser: (user: Omit <UserEntity, 'id'>) : Promise<UserEntity> => Promise.resolve({
            ...user,
            isAdmin: false,
            id: '1234fs-1234fs-1234fs-1234fs'
        })
    }

    const muckJwtService = {
        sign: (payload) => jwt.sign(payload, 'testSecret')
    }

     const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {provide: JwtService, useValue: muckJwtService}, 
            {
            provide: UsersDbService,
            useValue: mockUserService
            },
        ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    })

 it ('Create an instance of authService', async () => {
    expect(authService).toBeDefined()
})

 it ('signUp() creates a new user with an encripted password', async () => {
    const user = await authService.signUp(mockUser)
    expect(user).toBeDefined()
    expect(user.password).not.toEqual(mockUser.password)

  }) 
 
  it ('signUp() throws an error if the email is already in use', async () => {
      mockUserService.getUserByEmail = (email: string) => 
        Promise.resolve(mockUser as UserEntity)
      try {
        await authService.signUp(mockUser as UserEntity)
      } catch (error) {
        expect(error.message).toEqual('Email already in use')
      }
  })

  it ('signIn() returns an errorr is the password is invalid', async () => {
    mockUserService.getUserByEmail = (email: string) => 
        Promise.resolve(mockUser as UserEntity)
    try {
        await authService.signIn(mockUser.email, 'INVALID PASSWORD')
    } catch (error) {
        expect(error.message).toEqual('Invalid password')
    }
  })

  it ('signIn() returns an errorr is the user is not found', async () => {
   
    try {
        await authService.signIn(mockUser.email, mockUser.password)
    } catch (error) {
        expect(error.message).toEqual('User not found')
    }
  })

  it ('signIn() return an object withe a message and a token if the user is found and the password is valid', async () => {
    const mockUserVariant = {
        ...mockUser, 
        password: await bcrypt.hash(mockUser.password, 10)
    }
    mockUserService.getUserByEmail = (email: string) => Promise.resolve(mockUserVariant as UserEntity)

    const response = await authService.signIn(mockUser.email, mockUser.password)

    expect(response).toBeDefined()
    expect(response.token).toBeDefined()
    expect(response.success).toEqual('User logged in successfully')


  })

})

