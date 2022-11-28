import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from '@vueuse/core'

export const useNewStore = defineStore('newsStore', () => {
  const topNewsList = ref<Array<number>>([])
  const newNewsList = ref<Array<number>>([])
  const bestNewsList = ref<Array<number>>([])
  const isNewsListFetching = ref<boolean>(false)

  const getTopNewsList = async () => {
    try {
      const { data } = await useFetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
      topNewsList.value = JSON.parse(data.value as string) as Array<number>
    }
    catch (error) {
      console.log(error)
    }
  }

  const getNewNewsList = async () => {
    try {
      const { data } = await useFetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
      newNewsList.value = JSON.parse(data.value as string) as Array<number>
    }
    catch (error) {
      console.log(error)
    }
  }

  const getBestNewsList = async () => {
    try {
      const { data } = await useFetch('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty')
      bestNewsList.value = JSON.parse(data.value as string) as Array<number>
    }
    catch (error) {
      console.log(error)
    }
  }

  const fetchAllNews = async () => {
    try {
      isNewsListFetching.value = true

      await Promise.all([getTopNewsList(), getBestNewsList(), getNewNewsList()])
    }
    catch (error) {
      console.log(error)
    }
    isNewsListFetching.value = false
  }

  return { topNewsList, newNewsList, bestNewsList, isNewsListFetching, getTopNewsList, getNewNewsList, getBestNewsList, fetchAllNews }
})