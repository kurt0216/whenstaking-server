interface Template {
  contract: string;
  name: string;
  template_id: string;
  is_transferable: boolean;
  is_burnable: boolean;
  issued_supply: string;
  max_supply: string;
  collection_name: string;
  schema_name: string;
  immutable_data: any;
  created_at_time: string;
  created_at_block: string;
}

export default Template;
