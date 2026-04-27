import { supabase } from '@/lib/supabase';
import type { InsertTables, Tables } from '@/types/database';

export interface OrderWithDetails extends Tables<'orders'> {
  item: Tables<'items'> & { item_media: Tables<'item_media'>[] };
  buyer: Tables<'users'>;
  seller: Tables<'users'>;
  address: Tables<'addresses'>;
}

async function getOrdersByRole(
  userId: string,
  role: "buyer" | "seller",
  status?: string
): Promise<OrderWithDetails[]> {
  let query = supabase
    .from('orders')
    .select(
      '*, item:items(*, item_media(*)), buyer:users!buyer_id(*), seller:users!seller_id(*), address:addresses(*)'
    )
    .eq(role === "buyer" ? "buyer_id" : "seller_id", userId)
    .order('created_at', { ascending: false });

  if (status && status !== "all") {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as OrderWithDetails[];
}

export async function getBuyingOrders(
  userId: string,
  status?: string
): Promise<OrderWithDetails[]> {
  return getOrdersByRole(userId, "buyer", status);
}

export async function getSellingOrders(
  userId: string,
  status?: string
): Promise<OrderWithDetails[]> {
  return getOrdersByRole(userId, "seller", status);
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
