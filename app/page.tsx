'use client'
import RecentSearches from '@/components/ui/recentSearches'
import LeaguesMarquee from './leaguesMarquee'
import LeagueSearchForm from './leagueSearchForm'
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
        <section className="bg-gradient-to-b from-white to-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex sm:flex-row justify-center">
              <h1 className="flex flex-col sm:flex-row items-center text-3xl font-bold mb-4 text-gray-800">
                <Zap className="hidden sm:block sm:flex-0 h-8 w-8 mr-2 text-gray-600 animate-pulse" />
                Fantasy Football&nbsp;
                <span className="text-gray-600">Meets AI</span>
              </h1>
            </div>
            <p className="text-xl mb-8 text-gray-600">
              <span className="text-gray-800 font-semibold">
                {animatedText}
              </span>{' '}
              your league with cutting-edge AI insights
            </p>
            <LeagueSearchForm />
            <div className="flex justify-end"></div>
          </div>
        </section>
      </main>
      <div className="p-2 sm:p-4 max-w-3xl mx-auto">
        <RecentSearches />
        <LeaguesMarquee />
      </div>
    </>
  )
}
