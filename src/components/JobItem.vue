<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import NewsLoader from './NewsLoader.vue'
import type { Jobs } from '@/types/Jobs'
import { getDomainName, timeDifference } from '@/utils'

// set props
interface Props {
  id: number
}
const props = withDefaults(defineProps<Props>(), {
  id: NaN,
})

const { data: job, isPending } = useQuery<Jobs>({
  queryKey: ['jobItem', props.id],
  queryFn: async () => {
    const resp = await axios.get((`https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`))
    return resp.data
  },
  enabled: !!props.id,
})
</script>

<template>
  <NewsLoader v-if="isPending" />
  <div v-else-if="job" class="border-b-2 card-layout">
    <div class="flex justify-center items-center w-12 sm:w-20 p-5">
      <p class="text-center font-semibold text-[#f3621d] text-sm sm:text-xl">
        {{ job.score }}
      </p>
    </div>
    <div class="flex flex-col justify-center sm:overflow-hidden sm:truncate my-4 sm:my-0">
      <div class="flex items-center font-mono space-x-1  ">
        <a
          :href="job.url" target="_blank"
          class="text-sm  sm:text-base sm:truncate  font-medium hover:decoration-orange-500 "
          :class="{ 'hover:underline': Boolean(getDomainName(job.url)) }"
        >
          {{ job.title }}
        </a>
        <p v-if="Boolean(getDomainName(job.url))" class="hidden sm:block sm:truncate text-xs sm:text-sm text-slate-500">
          ({{ getDomainName(job.url) }})
        </p>
      </div>
      <div class="flex text-xs sm:text-sm text-slate-500  ">
        <router-link :to="`/user/${job.by}`">
          by <span class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500">{{ job.by }}</span>
        </router-link>
        <p class="px-1 sm:px-4">
          |
        </p>
        <p><span class="hidden sm:inline">created</span>  {{ timeDifference(job.time) }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Something went wrong</p>
  </div>
</template>

<style scoped>
.card-layout{
  display: grid;
  grid-template-columns: 1fr 11fr;
}
</style>
