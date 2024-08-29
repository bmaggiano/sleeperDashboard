'use server'

import { combineUserAndRosterInfoCard } from '../utils'
import UserCard from '@/components/ui/userCard'

export default async function PlayersServer({
  leagueId,
}: {
  leagueId: string
}) {
  const users = await combineUserAndRosterInfoCard(leagueId)
  if (!users) return <p>No users found.</p>
  return (
    <div className="">
      {users &&
        users.map((user: any) => (
          <UserCard key={user.user.user_id} user={user} viewRoster={true} />
        ))}
    </div>
  )
}
