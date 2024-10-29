'use client'

import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface props {
  children: ReactNode
}

const Providers = ({ children }: props) => {
  return <SessionProvider basePath="/api/auth">{children}</SessionProvider>
}

export default Providers
