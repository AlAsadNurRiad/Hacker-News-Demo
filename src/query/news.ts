import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { type MaybeRef, unref } from 'vue'

export const getNews = (type: MaybeRef<string>) => {
  return useQuery<Array<number>>({
    queryKey: ['news', type],
    queryFn: async () => {
      const resp = await axios.get(`https://hacker-news.firebaseio.com/v0/${unref(type)}stories.json?print=pretty`)
      return resp.data
    },
    staleTime: 5000,
  })
}
