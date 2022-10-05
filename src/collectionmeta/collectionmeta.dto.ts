import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

class CreateCollectionMetaDto {
  @IsString()
  public collection_name: string;

  @IsArray()
  public schemas: string[];

  @IsArray()
  public multis: string[];

  @IsNumber()
  public base_capacity: string;
}

export default CreateCollectionMetaDto;
