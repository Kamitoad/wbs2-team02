import {ApiProperty} from "@nestjs/swagger";

export class ProfilePicResponseDto {
    @ApiProperty({ description: 'Der Dateiname des neuen Profilbildes', example: 'profile-pic.png' })
    newProfilePic: string;
}