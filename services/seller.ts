import { supabase } from '@/lib/supabase';
import type { InsertTables, Tables } from '@/types/database';

export async function getSellerApplication(
  userId: string
): Promise<Tables<'seller_applications'> | null> {
  const { data, error } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function submitSellerApplication(
  application: InsertTables<'seller_applications'>
) {
  const { data, error } = await supabase
    .from('seller_applications')
    .insert(application)
    .select()
    .single();
  if (error) throw error;
  return data;
}
