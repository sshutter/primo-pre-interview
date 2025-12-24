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

  // Encrypt payload
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
      const { payload } = requestDto;

      // AES key and IV
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      // Encrypt cipher
      const cipher = crypto.createCipheriv(this.algo, aesKey, iv);

      // Encrypt payload
      let data2 = cipher.update(payload, 'utf8', 'base64');

      // Convert to String
      data2 += cipher.final('base64');

      /// Encrypt AES key with private key
      let data1 = crypto
        .privateEncrypt(
          { key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
          Buffer.concat([aesKey, iv]),
        )
        .toString('base64');

      data = {
        data1: data1,
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
      // Decrypt AES key with public key
      const decryptedKey = crypto.publicDecrypt(
        this.publicKey,
        Buffer.from(data1, 'base64'),
      );

      const aesKey = decryptedKey.slice(0, 32);
      const iv = decryptedKey.slice(32, 48);

      // Decrypt cipher
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
