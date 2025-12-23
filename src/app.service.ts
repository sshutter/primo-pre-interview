import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import {
  EncryptedRequestDto,
  EncryptedResponseDto,
} from './dtos/encrypted.dto';
import {
  DecryptedRequestDto,
  DecryptedResponseDto,
} from './dtos/decrypted.dto';

@Injectable()
export class AppService {
  private publicKey = fs.readFileSync('keys/public.pem', 'utf8');
  private privateKey = fs.readFileSync('keys/private.pem', 'utf8');
  private algo = 'aes-256-cbc';

  getEncryptData(requestDto: EncryptedRequestDto): EncryptedResponseDto {
    if (!this.privateKey) {
      return {
        successful: false,
        error_code: 'PRIVATE_KEY_NOT_FOUND',
        data: null,
      };
    }

    let successful: boolean = true;
    let error_code: string = '';
    let data: EncryptedResponseDto['data'] = null;

    try {
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      const { payload } = requestDto;

      const cipher = crypto.createCipheriv(this.algo, aesKey, iv);
      let data2 = cipher.update(payload, 'utf8', 'base64');
      data2 += cipher.final('base64');

      let data1 = crypto.privateEncrypt(
        { key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.concat([aesKey, iv]),
      );

      data = {
        data1: data1.toString('base64'),
        data2: data2,
      };
    } catch (error) {
      successful = false;
      error_code = 'ENCRYPTION_FAILED';
    }

    return {
      successful: successful,
      error_code: error_code,
      data: data,
    };
  }

  getDecryptData(requestDto: DecryptedRequestDto): DecryptedResponseDto {
    if (!this.publicKey) {
      return {
        successful: false,
        error_code: 'PUBLIC_KEY_NOT_FOUND',
        data: null,
      };
    }

    let data1: string = requestDto.data1;
    let data2: string = requestDto.data2;

    let successful: boolean = true;
    let error_code: string = '';
    let data: DecryptedResponseDto['data'] = null;

    try {
      const decryptedKey = crypto.publicDecrypt(
        this.publicKey,
        Buffer.from(data1, 'base64'),
      );
      const aesKey = decryptedKey.slice(0, 32);
      const iv = decryptedKey.slice(32, 48);

      const decipher = crypto.createDecipheriv(this.algo, aesKey, iv);
      let payload = decipher.update(data2, 'base64', 'utf8');
      payload += decipher.final('utf8');

      data = {
        payload: payload,
      };
    } catch (error) {
      successful = false;
      error_code = 'DECRYPTION_FAILED';
    }
    return {
      successful: successful,
      error_code: error_code,
      data: data,
    };
  }
}
