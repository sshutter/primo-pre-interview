import {
  IsBoolean,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';

export class DecryptedRequestDto {
  @IsString()
  data1: string;
  @IsString()
  data2: string;
}

export class DecryptedResponseDto {
  @IsBoolean()
  successful: boolean;

  @IsString()
  error_code: string;

  @IsOptional()
  @ValidateNested()
  data: DecryptedDataDto | null;
}

class DecryptedDataDto {
  @IsString()
  payload: string;
}
