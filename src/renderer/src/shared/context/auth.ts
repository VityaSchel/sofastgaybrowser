import React from 'react'
export const AuthContext = React.createContext<{ token: string } | null>(null)