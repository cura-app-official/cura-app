import { supabase } from '@/lib/supabase';
import type { ItemWithMedia } from './items';

export async function getWishlistItems(userId: string): Promise<ItemWithMedia[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, item:items(*, item_media(*), seller:users!seller_id(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((w: any) => w.item).filter(Boolean) as ItemWithMedia[];
}

export async function toggleWishlist(userId: string, itemId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();

  if (existing) {
    await supabase.from('wishlist_items').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('wishlist_items').insert({ user_id: userId, item_id: itemId });
    return true;
  }
}

export async function isWishlisted(userId: string, itemId: string): Promise<boolean> {
  const { data } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();
  return !!data;
}

export async function getWishlistIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('wishlist_items')
    .select('item_id')
    .eq('user_id', userId);
  return (data ?? []).map((w) => w.item_id);
}
