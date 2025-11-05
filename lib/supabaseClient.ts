import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Hostel = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description?: string;
};

export type Building = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description?: string;
};

export type GraphNode = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  node_type: string;
};

export type GraphEdge = {
  from_node: number;
  to_node: number;
  weight: number;
};
