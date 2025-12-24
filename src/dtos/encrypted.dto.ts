import { Req } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Length,
  IsString,
  IsBoolean,
  IsOptional,
  Validate,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class EncryptedRequestDto {
  @ApiProperty({
    example: 'Plaintext',
    description: 'Text to be encrypted',
    maxLength: 2000,
    required: true,
  })
  @IsString()
  @Length(1, 2000)
  @IsNotEmpty()
  payload: string;
}

class EncryptedDataDto {
  @ApiProperty({
    example:
      'VeO8FZXUTlQZDkRb4qaDlwmy8jXS7MHsp8+YQr+V8GQneyNwAEbH+Ow0K7ocsB5TbbuzD6iVLdwVHREvkT1OiM7ocN6IQ6cLXyixPtRs05JaSwafWn6mc2n+H15fSvh2ZSw45kO/ZNGO6J+oXe0HR9Rm4ZkdiJ5WtlTIBjlN9c8=',
    description: 'Encrypted AES key and IV using private key',
  })
  @IsString()
  data1: string;

  @ApiProperty({
    example: 'PrDQCjwZ7r7WXUjPloP2lA==',
    description: 'Encrypted payload using AES',
  })
  @IsString()
  data2: string;
}

export class EncryptedResponseDto {
  @ApiProperty({
    example: true,
    description: 'Successful status',
  })
  @IsBoolean()
  successful: boolean;

  @ApiProperty({
    example: '',
    description: 'Error code if any',
  })
  @IsString()
  error_code: string;

  @ApiProperty({
    nullable: true,
    required: false,
    type: EncryptedDataDto,
    description: 'Response',
    example: {
      data1:
        'VeO8FZXUTlQZDkRb4qaDlwmy8jXS7MHsp8+YQr+V8GQneyNwAEbH+Ow0K7ocsB5TbbuzD6iVLdwVHREvkT1OiM7ocN6IQ6cLXyixPtRs05JaSwafWn6mc2n+H15fSvh2ZSw45kO/ZNGO6J+oXe0HR9Rm4ZkdiJ5WtlTIBjlN9c8=',
      data2: 'PrDQCjwZ7r7WXUjPloP2lA==',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EncryptedDataDto)
  data?: EncryptedDataDto | null;
}
