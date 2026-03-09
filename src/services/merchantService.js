import { supabase } from '../lib/supabase';

export const getMerchantStats = async (merchantId) => {
  const [customersRes, transactionsRes] = await Promise.all([
    supabase
      .from('customers')
      .select('id, points', { count: 'exact' })
      .eq('merchant_id', merchantId),
    supabase
      .from('transactions')
      .select('points')
      .eq('merchant_id', merchantId)
      .eq('type', 'earn'),
  ]);
  const totalPoints =
    transactionsRes.data?.reduce((sum, t) => sum + t.points, 0) || 0;
  return {
    totalCustomers: customersRes.count || 0,
    totalPoints,
    redeemedRewards: 0,
  };
};

export const getMerchantCustomers = async (merchantId) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`*, profiles:user_id (full_name, email, created_at)`)
    .eq('merchant_id', merchantId)
    .order('points', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addPointsToCustomer = async (
  customerId,
  points,
  merchantId,
  description = 'Points ajoutés'
) => {
  const { data: customer } = await supabase
    .from('customers')
    .select('points')
    .eq('id', customerId)
    .single();
  await supabase
    .from('customers')
    .update({ points: (customer?.points || 0) + points })
    .eq('id', customerId);
  await supabase.from('transactions').insert({
    customer_id: customerId,
    merchant_id: merchantId,
    points,
    type: 'earn',
    description,
  });
};

export const getMerchantRewards = async (merchantId) => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('points_required', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createReward = async (
  merchantId,
  { title, description, pointsRequired }
) => {
  const { data, error } = await supabase
    .from('rewards')
    .insert({
      merchant_id: merchantId,
      title,
      description,
      points_required: pointsRequired,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReward = async (rewardId) => {
  const { error } = await supabase.from('rewards').delete().eq('id', rewardId);
  if (error) throw error;
};

export const updateLoyaltyProgram = async (merchantId, updates) => {
  const { data, error } = await supabase
    .from('merchants')
    .update(updates)
    .eq('id', merchantId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getRecentTransactions = async (merchantId, limit = 20) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`*, customers:customer_id (*, profiles:user_id (full_name, email))`)
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};
