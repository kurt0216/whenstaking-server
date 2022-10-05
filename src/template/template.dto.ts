import {IsBoolean, IsObject, IsString} from 'class-validator';
import ImmutableDataDto from './immutable_data.dto';

class CreateTemplateDto {
  @IsString()
  public contract: string;

  @IsString()
  public name: string;

  @IsString()
  public template_id: string;

  @IsBoolean()
  public is_transferable: boolean;

  @IsBoolean()
  public is_burnable: boolean;

  @IsString()
  public issued_supply: string;

  @IsString()
  public max_supply: string;

  @IsObject()
  public immutable_data: ImmutableDataDto;

  @IsString()
  public created_at_time: string;

  @IsString()
  public created_at_block: string;
}

export default CreateTemplateDto;
