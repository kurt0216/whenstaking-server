import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

class CreateStateDto {
  @IsBoolean()
  public maintenance: boolean;

  @IsString()
  public admin: string;

  @IsString()
  public manager: string;

  @IsString()
  public epoch: string;

  @IsArray()
  public funding: string[];

  @IsString()
  public collections: string;

  @IsString()
  public expLvls: string[];
}

export default CreateStateDto;
