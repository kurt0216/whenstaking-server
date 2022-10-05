import { IsArray, IsBoolean, IsEmpty, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator';

class CreateAssetDto {
  @IsString()
  public contract: string;

  @IsString()
  public asset_id: string;

  @IsString()
  public owner: string;

  @IsString()
  public name: string;

  @IsBoolean()
  public is_transferable: boolean;

  @IsBoolean()
  public is_burnable: boolean;

  @IsString()
  public template_mint: string;

  @IsString()
  public collection_name: string;

  @IsString()
  public schema_name: string;

  @IsOptional()
  @IsString()
  public template_id: string;

  @IsArray()
  public backed_tokens: any[];

  @IsObject()
  public immutable_data: any;

  @IsObject()
  public mutable_data: any;

  @IsObject()
  public data: any;

  @IsOptional()
  @IsString()
  public burned_by_account: string;

  @IsOptional()
  @IsString()
  public burned_at_block: string;

  @IsOptional()
  @IsString()
  public burned_at_time: string;

  @IsString()
  public updated_at_block: string;

  @IsString()
  public updated_at_time: string;

  @IsString()
  public transferred_at_block: string;

  @IsString()
  public transferred_at_time: string;

  @IsOptional()
  @IsString()
  public mined_at_block: string;

  @IsOptional()
  @IsString()
  public minted_at_time: string;
}

export default CreateAssetDto;
