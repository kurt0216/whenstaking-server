import { IsString } from 'class-validator';

class CreateImmutableDataDto {
  @IsString()
  public img: string;

  @IsString()
  public name: string;
}

export default CreateImmutableDataDto;
