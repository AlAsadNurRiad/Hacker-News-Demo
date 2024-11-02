<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import NewsLoader from '../loader/NewsLoader.vue'
import type { News } from '@/types/News'
import { countComment, getDomainName, timeDifference } from '@/utils'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<{ id: number }>(), {
  id: NaN,
})

const route = useRoute()
const newsType = Array.isArray(route.params.type)
  ? route.params.type[0]
  : route.params.type || 'top'
const { data: news, isPending } = useQuery<News>({
  queryKey: [newsType, props.id],
  queryFn: async () => {
    const resp = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`,
    )
    return resp.data
  },
  enabled: !!props.id,
  staleTime: 300000,
})
</script>

<template>
  <NewsLoader v-if="isPending" />
  <div v-else-if="news" class="border-b-2 card-layout pr-3">
    <div class="flex justify-center items-center w-12 sm:w-20 p-5">
      <p class="text-center font-semibold text-[#f3621d] text-sm sm:text-xl">
        {{ news.score }}
      </p>
    </div>
    <div
      class="flex flex-col justify-center sm:overflow-hidden sm:truncate my-4 sm:my-0"
    >
      <div class="flex items-center font-mono space-x-1">
        <a
          :href="news.url"
          target="_blank"
          class="text-sm sm:text-base sm:truncate font-medium hover:decoration-orange-500"
          :class="{ 'hover:underline': Boolean(getDomainName(news.url)) }"
        >
          {{ news.title }}
        </a>
        <p
          v-if="Boolean(getDomainName(news.url))"
          class="hidden sm:block sm:truncate text-xs sm:text-sm text-slate-500"
        >
          ({{ getDomainName(news.url) }})
        </p>
      </div>
      <div class="flex text-xs sm:text-sm text-slate-500">
        <router-link :to="`/user/${news.by}`">
          by
          <span
            class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500"
            >{{ news.by }}</span
          >
        </router-link>
        <p class="px-1 sm:px-4">|</p>
        <router-link :to="`/news/${id}`">
          <p
            class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500"
          >
            {{ countComment(news.kids) }}
          </p>
        </router-link>
        <p class="px-1 sm:px-4">|</p>
        <p>
          <span class="hidden sm:inline">created</span>
          {{ timeDifference(news.time) }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Something went wrong</p>
  </div>
</template>

<style scoped>
.card-layout {
  display: grid;
  grid-template-columns: 1fr 11fr;
}
</style>
