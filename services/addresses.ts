import { supabase } from '@/lib/supabase';
import type { InsertTables, Tables, UpdateTables } from '@/types/database';

export async function getAddresses(userId: string): Promise<Tables<'addresses'>[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getDefaultAddress(userId: string): Promise<Tables<'addresses'> | null> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createAddress(address: InsertTables<'addresses'>) {
  const { data, error } = await supabase.from('addresses').insert(address).select().single();
  if (error) throw error;
  return data;
}

export async function updateAddress(id: string, updates: UpdateTables<'addresses'>) {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}
