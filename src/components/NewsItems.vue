<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import type { News } from '@/types/News'
import { timeDifference } from '@/utils/time'

// set props
interface Props {
  id: number
}
const props = withDefaults(defineProps<Props>(), {
  id: NaN,
})

const { data: news, isError, isPending } = useQuery<News>({
  queryKey: ['topNews', props.id],
  queryFn: async () => {
    const resp = await axios.get((`https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`))
    return resp.data
  },
  enabled: !!props.id,
})

const getDomainName = (url: string) => {
  if (url) {
    const spUrl = url.split('/')
    if (spUrl.length >= 3)
      return spUrl[2]
  }
  return ''
}

const countComment = (kids: Array<unknown>) => {
  if (kids?.length <= 1)
    return `${kids?.length} Comment`
  else if (kids?.length >= 1)
    return `${kids?.length} Comments`
  else return '0 Comment'
}
</script>

<template>
  <div v-if="isPending">
    Pending ...
  </div>
  <div v-else-if="news" class="border-b-2 card-layout pr-3">
    <div class="flex justify-center items-center w-12 sm:w-20 p-5">
      <p class="text-center font-semibold text-[#f3621d] text-sm sm:text-xl">
        {{ news.score }}
      </p>
    </div>
    <div class="flex flex-col justify-center sm:overflow-hidden sm:truncate my-4 sm:my-0">
      <div class="flex items-center font-mono space-x-1 ">
        <a
          :href="news.url"
          target="_blank" class="text-sm  sm:text-base sm:truncate  font-medium hover:decoration-orange-500 "
          :class="{ 'hover:underline': Boolean(getDomainName(news.url)) }"
        >
          {{ news.title }}
        </a>
        <p v-if="Boolean(getDomainName(news.url))" class="hidden sm:block sm:truncate text-xs sm:text-sm text-slate-500">
          ({{ getDomainName(news.url) }})
        </p>
      </div>
      <div class="flex text-xs sm:text-sm text-slate-500  ">
        <router-link :to="`/user/${news.by}`">
          by <span class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500">{{ news.by }}</span>
        </router-link>
        <p class="px-1 sm:px-4">
          |
        </p>
        <router-link :to="`/news/${id}`">
          <p class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500">
            {{ countComment(news.kids) }}
          </p>
        </router-link>
        <p class="px-1 sm:px-4">
          |
        </p>
        <p><span class="hidden sm:inline">created</span> {{ timeDifference(news.time) }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    Something went wrong
  </div>
</template>

<style scoped>
.card-layout{
  display: grid;
  grid-template-columns: 1fr 11fr;
}
</style>
