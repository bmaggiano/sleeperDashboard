import { useSession } from 'next-auth/react'
import LoginButton from './login'
import LogoutButton from './logout'

const AuthStatus = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (session) {
    return <LogoutButton />
  }

  return <LoginButton />
}

export default AuthStatus
