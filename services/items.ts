import { supabase } from '@/lib/supabase';
import type { InsertTables, Tables } from '@/types/database';

export interface ItemWithMedia extends Tables<'items'> {
  item_media: Tables<'item_media'>[];
  seller: Tables<'users'>;
}

export async function getItems(page = 0, limit = 20): Promise<ItemWithMedia[]> {
  const from = page * limit;
  const { data, error } = await supabase
    .from('items')
    .select('*, item_media(*), seller:users!seller_id(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (error) throw error;
  return (data ?? []) as unknown as ItemWithMedia[];
}

export async function getItem(id: string): Promise<ItemWithMedia> {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_media(*), seller:users!seller_id(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as unknown as ItemWithMedia;
}

export async function getItemsBySeller(sellerId: string): Promise<ItemWithMedia[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_media(*), seller:users!seller_id(*)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ItemWithMedia[];
}

export async function searchItems(query: string): Promise<ItemWithMedia[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_media(*), seller:users!seller_id(*)')
    .eq('status', 'active')
    .or(`item_name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as ItemWithMedia[];
}

export async function searchCreators(query: string): Promise<Tables<'users'>[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_seller', true)
    .ilike('username', `%${query}%`)
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function createItem(item: InsertTables<'items'>) {
  const { data, error } = await supabase.from('items').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function createItemMedia(media: InsertTables<'item_media'>[]) {
  const { error } = await supabase.from('item_media').insert(media);
  if (error) throw error;
}

export async function getItemsByCategory(category: string): Promise<ItemWithMedia[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*, item_media(*), seller:users!seller_id(*)')
    .eq('status', 'active')
    .eq('category', category)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ItemWithMedia[];
}
