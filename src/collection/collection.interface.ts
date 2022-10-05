interface Collections {
  contract: string;
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  data?: {
    img: string,
    name: string,
    url?: string,
    description?: string,
  };
  created_at_time: string;
  created_at_block: string;
}

export default Collections;
