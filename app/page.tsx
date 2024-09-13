'use client'
import RecentSearches from '@/components/ui/recentSearches'
import LeaguesMarquee from './leaguesMarquee'
import LeagueSearchForm from './leagueSearchForm'
import { AssistantModal } from '@/components/ui/assistant-ui/assistant-modal'
import { Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [animatedText, setAnimatedText] = useState('Dominate')
  const animatedWords = ['Dominate', 'Analyze', 'Predict', 'Win']

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedText((prev) => {
        const currentIndex = animatedWords.indexOf(prev)
        return animatedWords[(currentIndex + 1) % animatedWords.length]
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <main className="flex-1 my-4">
        <section className="bg-gradient-to-b from-white to-white py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="flex justify-center items-center text-3xl font-bold mb-4 text-gray-800">
              <Zap className=" h-8 w-8 mr-2 text-gray-600 animate-pulse" />
              Where Fantasy Football&nbsp;
              <span className="text-gray-600">Meets AI</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              <span className="text-black">{animatedText}</span> your league
              with cutting-edge AI insights
            </p>
            <LeagueSearchForm />
            <div className="flex justify-end"></div>
          </div>
        </section>
        {/* <section className="w-full py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <div className="absolute h-full w-full bg-gradient-to-t from-black to-transparent opacity-40" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Where Fantasy Football
                  <span className="text-gray-300 ml-2">Meets AI</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 text-lg">
                  <span className="font-bold text-white">Dominate</span> your
                  league with cutting-edge AI insights
                </p>
              </div>
              <LeagueSearchForm />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
          <Zap className="absolute bottom-4 right-4 h-12 w-12 text-white animate-pulse" />
        </section> */}
      </main>
      <div className="p-2 sm:p-4 max-w-3xl mx-auto">
        <AssistantModal />
        <RecentSearches />
        <LeaguesMarquee />
        {/* <LeagueSearchForm /> */}
      </div>
    </>
  )
}
