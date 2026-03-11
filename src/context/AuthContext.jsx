import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      if (profileData?.role === 'merchant') {
        const { data: merchantData } = await supabase
          .from('merchants')
          .select('*')
          .eq('user_id', userId)
          .single()
        setMerchant(merchantData || null)
      } else {
        setMerchant(null)
      }
    } catch (e) {
      console.error('fetchProfile error:', e)
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (e) {
        console.error('init error:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setMerchant(null)
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    setMerchant(null)
    await supabase.auth.signOut()
  }

  const refreshMerchant = async () => {
    if (!user) return
    const { data } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (data) setMerchant(data)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      merchant,
      loading,
      signIn,
      signOut,
      refreshMerchant,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)



