import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import LoginButton from './login'
import LogoutButton from './logout'

const AuthStatus = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return null
  }

  // Check if the user is on the "/compare" page and not logged in
  if (!session && pathname === '/compare') {
    return null // Don't show the login button on the "/compare" page
  }

  return session ? <LogoutButton /> : <LoginButton />
}

export default AuthStatus
