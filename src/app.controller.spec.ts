import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: INestApplication;
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Get Encrypt data', () => {
    it('should return correct response', () => {
      let req = {
        payload: 'Plaintext',
      };

      const res = appController.getEncryptData(req);
      expect(res.successful).toBe(true);
      expect(res.error_code).toBe('');
      expect(res.data).toHaveProperty('data1');
      expect(res.data).toHaveProperty('data2');
    });
  });

  describe('Get Decrypt data', () => {
    it('should return correct response', () => {
      let req = {
        data1:
          'VeO8FZXUTlQZDkRb4qaDlwmy8jXS7MHsp8+YQr+V8GQneyNwAEbH+Ow0K7ocsB5TbbuzD6iVLdwVHREvkT1OiM7ocN6IQ6cLXyixPtRs05JaSwafWn6mc2n+H15fSvh2ZSw45kO/ZNGO6J+oXe0HR9Rm4ZkdiJ5WtlTIBjlN9c8=',
        data2: 'PrDQCjwZ7r7WXUjPloP2lA==',
      };

      const res = appController.getDecryptData(req);

      expect(res.successful).toBe(true);
      expect(res.error_code).toBe('');
      expect(res.data).toHaveProperty('payload');
      expect(res.data?.payload).toBe('Plaintext');
    });
  });
});
