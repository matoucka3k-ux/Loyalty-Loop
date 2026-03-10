import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadProfile = async (userId) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (profileData) {
        setProfile(profileData)
        if (profileData.role === 'merchant') {
          const { data: merchantData } = await supabase
            .from('merchants')
            .select('*')
            .eq('user_id', userId)
            .single()
          setMerchant(merchantData)
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
    }).catch(() => {})

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
        setMerchant(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUpMerchant = async ({ email, password, fullName, businessName }) => {
    // 1. Créer le compte
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) throw signUpError

    // 2. Se connecter immédiatement pour avoir une session active
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw signInError

    const userId = signInData.user.id

    // 3. Insérer le profil avec la session active
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, email, role: 'merchant', full_name: fullName })
    if (profileError) throw profileError

    // 4. Insérer le merchant
    const slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
    const { data: merchantData, error: merchantError } = await supabase
      .from('merchants')
      .insert({ user_id: userId, business_name: businessName, points_per_euro: 1, slug })
      .select()
      .single()
    if (merchantError) throw merchantError

    // 5. Mettre à jour le state
    setUser(signInData.user)
    setProfile({ id: userId, email, role: 'merchant', full_name: fullName })
    setMerchant(merchantData)

    return signInData
  }

  const signUpCustomer = async ({ email, password, fullName, merchantId }) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw signInError

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: signInData.user.id, email, role: 'customer', full_name: fullName })
    if (profileError) throw profileError

    if (merchantId) {
      await supabase
        .from('customers')
        .insert({ user_id: signInData.user.id, merchant_id: merchantId, points: 0 })
    }

    return signInData
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setMerchant(null)
  }

  const refreshMerchant = async () => {
    if (user) {
      const { data } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setMerchant(data)
    }
  }

  const value = {
    user, profile, merchant, loading,
    signUpMerchant, signUpCustomer, signIn, signOut, refreshMerchant,
    isMerchant: profile?.role === 'merchant',
    isCustomer: profile?.role === 'customer',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


