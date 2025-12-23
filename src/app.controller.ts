import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  EncryptedRequestDto,
  EncryptedResponseDto,
} from './dtos/encrypted.dto';
import {
  DecryptedRequestDto,
  DecryptedResponseDto,
} from './dtos/decrypted.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/get-encrypt-data')
  getEncryptData(@Body() body: EncryptedRequestDto): EncryptedResponseDto {
    return this.appService.getEncryptData(body);
  }

  @Post('/get-decrypt-data')
  getDecryptData(@Body() body: DecryptedRequestDto): DecryptedResponseDto {
    return this.appService.getDecryptData(body);
  }
}
