import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

export class DecryptedRequestDto {
  @ApiProperty({
    required: true,
    description: 'Encrypted AES key',
    example:
      'VeO8FZXUTlQZDkRb4qaDlwmy8jXS7MHsp8+YQr+V8GQneyNwAEbH+Ow0K7ocsB5TbbuzD6iVLdwVHREvkT1OiM7ocN6IQ6cLXyixPtRs05JaSwafWn6mc2n+H15fSvh2ZSw45kO/ZNGO6J+oXe0HR9Rm4ZkdiJ5WtlTIBjlN9c8=',
  })
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiProperty({
    required: true,
    description: 'Encrypted payload',
    example: 'PrDQCjwZ7r7WXUjPloP2lA==',
  })
  @IsString()
  @IsNotEmpty()
  data2: string;
}

class DecryptedDataDto {
  @ApiProperty({
    example: 'Plaintext',
    description: 'Decrypted payload',
  })
  @IsString()
  payload: string;
}

export class DecryptedResponseDto {
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
    type: DecryptedDataDto,
    description: 'Response',
    example: {
      payload: 'Plaintext',
    },
  })
  @IsOptional()
  @ValidateNested()
  data: DecryptedDataDto | null;
}
