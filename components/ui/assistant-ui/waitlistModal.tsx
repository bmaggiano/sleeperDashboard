'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import WaitlistHelper from './waitlistHelper'
import { useToast } from '@/components/ui/use-toast'

interface WaitlistModalProps {
  onJoinWaitlist: () => void
}

export default function WaitlistModal({ onJoinWaitlist }: WaitlistModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string

    try {
      const result = await WaitlistHelper({ email })
      if (result.message === 'success') {
        localStorage.setItem('isOnWaitlist', 'true')
        onJoinWaitlist()
      } else {
        toast({ title: 'Error', description: result.error })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while joining the waitlist.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Enter Waitlist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stuart AI Waitlist</DialogTitle>
          <DialogDescription>
            Stuart AI is currently in production. Join the waitlist to be
            notified when AI features are ready.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-2">
          <Input
            name="email"
            required={true}
            type="email"
            showArrowButton={false}
            placeholder="Enter your email"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
