'use server'
import FuzzySearch from '../fuzzySearch'
import ParlayHelperClient from './parlayHelperClient'
export default async function ParlayHelper() {
  return (
    <>
      <ParlayHelperClient />
    </>
  )
}
