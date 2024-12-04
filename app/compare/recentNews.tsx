const teamIdMap: Record<string, number> = {
  AZ: 22,
  ATL: 1,
  BAL: 33,
  BUF: 2,
  CAR: 29,
  CHI: 3,
  CIN: 4,
  CLE: 5,
  DAL: 6,
  DEN: 7,
  DET: 8,
  GB: 9,
  HOU: 34,
  IND: 11,
  JAX: 30,
  KC: 12,
  LAC: 24,
  LAR: 14,
  LV: 13,
  MIA: 15,
  MIN: 16,
  NE: 17,
  NO: 18,
  NYG: 19,
  NYJ: 20,
  PHI: 21,
  PIT: 23,
  SEA: 26,
  SF: 25,
  TB: 27,
  TEN: 10,
  WAS: 28,
}

export default async function fetchAndFilterStories(
  athleteId: number,
  team: string
) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?team=${teamIdMap[team]}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonResponse = await response.json()

    // Filter the articles where type is "Story" and athleteId matches the given value
    const filteredArticles =
      jsonResponse.articles?.filter(
        (article: any) =>
          article.type === 'Story' || article.type === 'HeadlineNews'
      ) || []

    // Map over the filtered articles to return their links property
    const articleLinks = filteredArticles.map(
      (article: any) => article.links.api.self.href
    )

    // Fetch story content for each link
    const storyPromises = articleLinks.map(fetchStoryContent)
    const storiesContent = await Promise.all(storyPromises)

    return storiesContent
  } catch (error) {
    console.error('Error fetching or parsing the news:', error)
    return []
  }
}

async function fetchStoryContent(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonResponse = await response.json()
    // Extract the story from the headlines
    const story = jsonResponse.headlines?.[0]?.story || ''
    const storyTitle = jsonResponse.headlines?.[0]?.title || ''
    const storyLink = jsonResponse.headlines?.[0]?.links?.web?.href || ''
    const published = jsonResponse.headlines?.[0]?.published || ''

    return { story, storyTitle, storyLink, published }
  } catch (error) {
    console.error('Error fetching or parsing the story:', error)
    return { story: '', storyTitle: '', storyLink: '', published: '' }
  }
}
