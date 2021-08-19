import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/creatUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserResponseInterface } from './types/userResponse.interface';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './dto/login.user.dt';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findById(id:number): Promise<UserEntity> {
        return this.userRepository.findOne(id);
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({ email : createUserDto.email });
        const userByUsername = await this.userRepository.findOne({ username : createUserDto.username });
        if (userByEmail || userByUsername ) {
            throw new HttpException(
                'Email or username are taken.',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        const newUser = new UserEntity();
        Object.assign<UserEntity,CreateUserDto>(newUser,createUserDto);
        // delete newUser.password;
        console.log('newUser',newUser);
        return await this.userRepository.save(newUser);
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ email: loginUserDto.email},
            {select:['id','username','email','password','bio','image']});
        if (!user) {
            throw new HttpException(
                'Credentials are not valid!',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

        const vlaidPass = await compare(loginUserDto.password, user.password);
        if (!vlaidPass) {
            throw new HttpException(
                'Credentials are not valid!',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }
        delete user.password;
        return user;
    }

    async updateUser(id:number,updateUserDto: UpdateUserDto): Promise<UserEntity> {
        
        try{
            console.log('clicked!');
            const user = await this.findById(id);
            console.log('update-user',user);
                if(user){
                Object.assign<UserEntity,UpdateUserDto>(user,updateUserDto);
                if(await this.userRepository.save(user)) {
                    console.log('update-dto',user);
                    return user;
                }}
        } catch(e) {
            return Object.assign<UserEntity,UpdateUserDto>(new UserEntity(),updateUserDto);
        }
    }

    generateJwt(user: UserEntity): string {
        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET);
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }
}
