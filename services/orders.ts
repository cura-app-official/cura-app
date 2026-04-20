import { supabase } from '@/lib/supabase';
import type { InsertTables, Tables } from '@/types/database';

export interface OrderWithDetails extends Tables<'orders'> {
  item: Tables<'items'> & { item_media: Tables<'item_media'>[] };
  buyer: Tables<'users'>;
  seller: Tables<'users'>;
  address: Tables<'addresses'>;
}

export async function getOrders(
  userId: string,
  status?: string
): Promise<OrderWithDetails[]> {
  let query = supabase
    .from('orders')
    .select(
      '*, item:items(*, item_media(*)), buyer:users!buyer_id(*), seller:users!seller_id(*), address:addresses(*)'
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as OrderWithDetails[];
}

export async function createOrder(order: InsertTables<'orders'>) {
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
