export type BlockDbDetails = {
  id: string;

  timestamp: number;
  hash: string | null;
  pow: number;
  data: string;
  previous_hash: string | null;

  created_at: string;
  updated_at: string;
};
