import { IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  public account: string;

  @IsString()
  public assets: string;
}

export default CreateUserDto;
