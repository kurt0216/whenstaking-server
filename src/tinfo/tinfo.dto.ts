import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateTinfoDto {
  @IsString()
  public asset_id: string;

  @IsOptional()
  @IsString()
  public owner: string;

  @IsNumber()
  public level: number;

  @IsNumber()
  public staked: number;

  @IsString()
  public epoch: string;

  @IsArray()
  public quantity: string[];

  @IsArray()
  public value: any[];

  @IsArray()
  public tpts: any[];
}

export default CreateTinfoDto;
