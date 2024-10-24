import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import LeagueSearchForm from './leagueSearchForm'

export default function NoLeaguesFoundEmpty() {
  return (
    <Card className="text-center my-4">
      <CardHeader>
        <h1 className="text-lg font-medium">No leagues found.</h1>
      </CardHeader>
      <CardContent>
        You haven&apos;t linked any leagues to your account yet. Try searching
        for a league to get started.
        <LeagueSearchForm />
      </CardContent>
    </Card>
  )
}
