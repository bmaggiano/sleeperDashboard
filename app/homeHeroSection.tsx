'use client'
import LeagueSearchForm from './leagueSearchForm'
import { Zap } from 'lucide-react'
import NoLeaguesFoundEmpty from './noLeaguesFoundEmpty'

export default function HomeHeroSection({
  fetchedDetails,
}: {
  fetchedDetails: any
}) {
  return (
    <main className="flex-1 my-4">
      <div className="flex flex-col justify-center p-4 space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
            <Zap className="mr-1 h-4 w-4" />
            Powered by AI
          </div>
          <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Fantasy Football Meets AI
          </h1>
          <p className="text-center text-muted-foreground md:text-xl">
            Dominate your league with cutting-edge AI insights. Get personalized
            player recommendations, player prop analysis, and winning
            strategies.
          </p>
        </div>
      </div>
      {fetchedDetails.length > 0 ? (
        <LeagueSearchForm />
      ) : (
        <NoLeaguesFoundEmpty />
      )}
    </main>
  )
}
