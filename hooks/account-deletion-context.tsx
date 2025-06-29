"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface AccountDeletionContextType {
  isDeletingAccount: boolean
  setIsDeletingAccount: (deleting: boolean) => void
}

const AccountDeletionContext = createContext<AccountDeletionContextType | undefined>(undefined)

export function AccountDeletionProvider({ children }: { children: ReactNode }) {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  return (
    <AccountDeletionContext.Provider value={{ isDeletingAccount, setIsDeletingAccount }}>
      {children}
    </AccountDeletionContext.Provider>
  )
}

export function useAccountDeletion() {
  const context = useContext(AccountDeletionContext)
  if (context === undefined) {
    throw new Error('useAccountDeletion must be used within an AccountDeletionProvider')
  }
  return context
}
