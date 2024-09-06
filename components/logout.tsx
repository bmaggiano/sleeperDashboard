import { signOut } from 'next-auth/react'
import { Button } from './ui/button'

const LogoutButton = () => {
  const handleLogout = () => {
    signOut() // Trigger logout
  }

  return <Button onClick={handleLogout}>Sign out</Button>
}

export default LogoutButton
