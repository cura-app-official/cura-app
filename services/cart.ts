import { supabase } from '@/lib/supabase';
import type { ItemWithMedia } from './items';

export interface CartItemWithDetails {
  id: string;
  item: ItemWithMedia;
}

export async function getCartItems(userId: string): Promise<CartItemWithDetails[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, item:items(*, item_media(*), seller:users!seller_id(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c: any) => ({ id: c.id, item: c.item })).filter((c: any) => c.item) as CartItemWithDetails[];
}

export async function addToCart(userId: string, itemId: string) {
  const { error } = await supabase.from('cart_items').insert({ user_id: userId, item_id: itemId });
  if (error) throw error;
}

export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
  if (error) throw error;
}

export async function clearCart(userId: string) {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (error) throw error;
}

export async function isInCart(userId: string, itemId: string): Promise<boolean> {
  const { data } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();
  return !!data;
}
