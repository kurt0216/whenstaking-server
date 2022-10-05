import { IsOptional, IsString } from 'class-validator';

class CreateDataDto {
  @IsString()
  public img: string;

  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public url: string;

  @IsString()
  @IsOptional()
  public description: string;
}

export default CreateDataDto;
