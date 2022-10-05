import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';
import CreateDataDto from './data.dto';

class CreateCollectionDto {
  @IsString()
  public contract: string;

  @IsString()
  public collection_name: string;

  @IsString()
  public name: string;

  @IsString()
  public img: string;

  @IsString()
  public author: string;

  @IsBoolean()
  public allow_notify: boolean;

  @IsArray()
  public authorized_accounts: string[];

  @IsArray()
  public notify_accounts: string[];

  @IsNumber()
  public market_fee: number;

  @IsObject()
  public data: CreateDataDto;

  @IsString()
  public created_at_time: string;

  @IsString()
  public created_at_block: string;
}

export default CreateCollectionDto;
