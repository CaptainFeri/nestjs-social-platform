import { Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/creatUser.dto';
import { LoginUserDto } from './dto/login.user.dt';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './Guards/auth.guard';
import { Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Param } from '@nestjs/common';
import { ArticleResponseInterface } from 'src/article/types/articleResponse.interface';

@Controller('users/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register/')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post('login/')
    @UsePipes(new ValidationPipe())
    async login(
        @Body("user") loginUserDto : LoginUserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
        console.log('get user profile',user);
        if(user){
            return this.userService.buildUserResponse(user);
        }
        return null;
    }

    @Put('user')
    @UseGuards(AuthGuard)
    async updateCurrentUser(@User('id') currentUserId: number,@Body('user') updateUserDto: UpdateUserDto): Promise<UserResponseInterface> {
        const existUser = await this.userService.findById(currentUserId);
        if(existUser) {
            const user = await this.userService.updateUser(currentUserId,updateUserDto);
            if(user === existUser) {
                return this.userService.buildUserResponse(user);
            }
        }
    }

}
