import { signIn } from 'next-auth/react'
import { Button } from './ui/button'

const LoginButton = () => {
  const handleLogin = () => {
    signIn('google') // Trigger Google sign-in
  }

  return <Button onClick={handleLogin}>Log in</Button>
}

export default LoginButton
