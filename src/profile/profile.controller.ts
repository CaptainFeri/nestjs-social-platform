import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';

@Controller('profiles')
export class ProfileController {
    @Get(':username')
    async getProfile(@User() currentUser: UserEntity,@Param('username') username: string) {
        
    }
}
