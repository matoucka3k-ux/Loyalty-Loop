import { supabase } from '../lib/supabase';

export const getCustomerData = async (userId, merchantId) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .eq('merchant_id', merchantId)
    .single();
  if (error) return null;
  return data;
};

export const getCustomerMerchants = async (userId) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`*, merchants:merchant_id (*)`)
    .eq('user_id', userId);
  if (error) throw error;
  return data || [];
};

export const getCustomerTransactions = async (customerId, limit = 20) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const getAvailableRewards = async (merchantId) => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_active', true)
    .order('points_required', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const redeemReward = async (
  customerId,
  rewardId,
  merchantId,
  pointsCost
) => {
  const { data: customer } = await supabase
    .from('customers')
    .select('points')
    .eq('id', customerId)
    .single();
  if (!customer || customer.points < pointsCost)
    throw new Error('Points insuffisants');
  await supabase
    .from('customers')
    .update({ points: customer.points - pointsCost })
    .eq('id', customerId);
  await supabase.from('transactions').insert({
    customer_id: customerId,
    merchant_id: merchantId,
    points: -pointsCost,
    type: 'redeem',
    description: 'Récompense débloquée',
  });
  await supabase.from('redeemed_rewards').insert({
    customer_id: customerId,
    reward_id: rewardId,
  });
};

export const getMerchantBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
};

export const getMerchantById = async (merchantId) => {
  const { data } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();
  return data;
};
