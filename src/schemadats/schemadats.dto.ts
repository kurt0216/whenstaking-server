import { IsArray, IsString } from 'class-validator';

class CreateSchemaDatsDto {
  @IsString()
  public schema_name: string;

  @IsArray()
  public epoch: string[];

  @IsString()
  public identifier: string;

  @IsArray()
  public rarity_apr: string[];

  @IsArray()
  public rarity_cap: string[];

  @IsArray()
  public lvl_cap: string[];

  @IsArray()
  public whitelist: number[];

  @IsArray()
  public blacklist: number[];
}

export default CreateSchemaDatsDto;
