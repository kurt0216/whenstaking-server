import { IsArray, IsString } from 'class-validator';

class CreateTmplCapsDto {
  @IsString()
  public template_id: string;

  @IsArray()
  public value: string;
}

export default CreateTmplCapsDto;
