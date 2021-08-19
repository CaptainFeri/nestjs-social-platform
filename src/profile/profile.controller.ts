import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../user/Guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ) {}

    @Get(':username')
    async getProfile(@User('id') currentUserId: number,@Param('username') username: string): Promise<ProfileResponseInterface> {
        const profile  = await this.profileService.getProfile(currentUserId,username);
        return this.profileService.buildProfileResponse(profile);
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User() currentUser: UserEntity, @Param('username') profileUsername: string ):
    Promise<ProfileResponseInterface>{
        const profile  = await this.profileService.followProfile(currentUser.id,profileUsername);
        return this.profileService.buildProfileResponse(profile);
     }

     @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(@User() currentUser: UserEntity, @Param('username') profileUsername: string ):
    Promise<ProfileResponseInterface>{
        const profile  = await this.profileService.unfollowProfile(currentUser.id,profileUsername);
        return this.profileService.buildProfileResponse(profile);
     }

}
