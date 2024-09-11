import {ApiProperty} from "@nestjs/swagger";

export class UploadProfilePicDto {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Das hochzuladende Profilbild' })
    file: any;
}