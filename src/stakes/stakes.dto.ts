import {IsArray, IsString} from 'class-validator';

class CreateStakesDto {
  @IsString()
  public asset_id: string;

  @IsArray()
  public quantity: string[];

  @IsArray()
  public tpts: string[];
}

export default CreateStakesDto;
