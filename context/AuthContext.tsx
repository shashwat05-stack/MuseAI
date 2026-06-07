'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MUSEAI_CONFIG } from '@/lib/museaiConfig'

export type UserProfile = {
  email: string
  name: string
  avatar?: string
  joinedDate: string
}

type AuthContextType = {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<UserProfile>
  register: (email: string, name: string) => Promise<{ email: string; otpSent: boolean }>
  verifyOtp: (email: string, otp: string) => Promise<UserProfile>
  logout: () => void
  requestResetPassword: (email: string) => Promise<boolean>
  resetPassword: (email: string, token: string, newPass: string) => Promise<boolean>
  updateProfile: (updated: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem(MUSEAI_CONFIG.storageKeys.user)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse saved user', e)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _: string): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if user exists in local accounts list
    const accountsRaw = localStorage.getItem('museai_accounts')
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : []
    const existing = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase())

    let loggedInUser: UserProfile
    if (existing) {
      loggedInUser = {
        email: existing.email,
        name: existing.name || email.split('@')[0],
        avatar: existing.avatar || undefined,
        joinedDate: existing.joinedDate || new Date().toISOString(),
      }
    } else {
      // Create user on-the-fly for simple onboarding, or throw error. 
      // Let's create it for easy testing!
      loggedInUser = {
        email,
        name: email.split('@')[0],
        joinedDate: new Date().toISOString(),
      }
      accounts.push({ email, name: loggedInUser.name, joinedDate: loggedInUser.joinedDate })
      localStorage.setItem('museai_accounts', JSON.stringify(accounts))
    }

    localStorage.setItem(MUSEAI_CONFIG.storageKeys.user, JSON.stringify(loggedInUser))
    localStorage.setItem(MUSEAI_CONFIG.storageKeys.token, 'simulated_jwt_token')
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (email: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Save pending registration details in temp state
    localStorage.setItem('museai_pending_register', JSON.stringify({ email, name }))
    return { email, otpSent: true }
  }

  const verifyOtp = async (email: string, otp: string): Promise<UserProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    if (otp !== '123456' && otp.length !== 6) {
      throw new Error('Invalid verification code. Use 123456 for testing.')
    }

    const pendingRaw = localStorage.getItem('museai_pending_register')
    const pending = pendingRaw ? JSON.parse(pendingRaw) : { email, name: email.split('@')[0] }

    const newUser: UserProfile = {
      email: pending.email,
      name: pending.name,
      joinedDate: new Date().toISOString(),
    }

    // Save to accounts list
    const accountsRaw = localStorage.getItem('museai_accounts')
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : []
    if (!accounts.some((acc: any) => acc.email.toLowerCase() === pending.email.toLowerCase())) {
      accounts.push({ email: pending.email, name: pending.name, joinedDate: newUser.joinedDate })
      localStorage.setItem('museai_accounts', JSON.stringify(accounts))
    }

    localStorage.setItem(MUSEAI_CONFIG.storageKeys.user, JSON.stringify(newUser))
    localStorage.setItem(MUSEAI_CONFIG.storageKeys.token, 'simulated_jwt_token')
    localStorage.removeItem('museai_pending_register')
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem(MUSEAI_CONFIG.storageKeys.user)
    localStorage.removeItem(MUSEAI_CONFIG.storageKeys.token)
    setUser(null)
    router.push('/')
  }

  const requestResetPassword = async (_: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return true
  }

  const resetPassword = async (email: string, _: string, __: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Simulate making sure account exists
    const accountsRaw = localStorage.getItem('museai_accounts')
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : []
    const existingIdx = accounts.findIndex((acc: any) => acc.email.toLowerCase() === email.toLowerCase())
    if (existingIdx === -1) {
      accounts.push({ email, name: email.split('@')[0], joinedDate: new Date().toISOString() })
      localStorage.setItem('museai_accounts', JSON.stringify(accounts))
    }
    return true
  }

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return
    const nextUser = { ...user, ...updated }
    localStorage.setItem(MUSEAI_CONFIG.storageKeys.user, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        requestResetPassword,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
