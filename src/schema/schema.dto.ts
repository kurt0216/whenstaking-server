import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

class CreateSchemaDto {
  @IsString()
  public contract: string;

  @IsString()
  public schema_name: string;

  @IsString()
  public collection_name: string;

  @IsString()
  public created_at_time: string;

  @IsString()
  public created_at_block: string;
}

export default CreateSchemaDto;
