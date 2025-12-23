import {
  Length,
  IsString,
  IsBoolean,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';

export class EncryptedRequestDto {
  @IsString()
  @Length(1, 2000)
  payload: string;
}

export class EncryptedResponseDto {
  @IsBoolean()
  successful: boolean;

  @IsString()
  error_code: string;

  @IsOptional()
  @ValidateNested()
  data: EncryptedDataDto | null;
}

class EncryptedDataDto {
  @IsString()
  data1: string;

  @IsString()
  data2: string;
}
