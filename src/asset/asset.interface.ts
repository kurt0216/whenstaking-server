interface Asset {
  contract: string;
  asset_id: string;
  owner: string;
  name: string;
  is_transferable: boolean;
  is_burnable: boolean;
  template_mint: string;
  collection_name: string;
  schema_name: string;
  template_id: string;
  backed_tokens: any[];
  immutable_data: any;
  mutable_data: any;
  data: any;
  burned_by_account: string;
  burned_at_block: string;
  burned_at_time: string;
  updated_at_block: string;
  updated_at_time: string;
  transferred_at_block: string;
  transferred_at_time: string;
  minted_at_block: string;
  minted_at_time: string;
}

export default Asset;
