import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ) {}

    @Get(':username')
    async getProfile(@User() currentUser: UserEntity,@Param('username') username: string): Promise<ProfileResponseInterface> {
        const profile  = await this.profileService.getProfile(currentUser.id,username);
        return this.profileService.buildProfileResponse(profile);
    }
}
