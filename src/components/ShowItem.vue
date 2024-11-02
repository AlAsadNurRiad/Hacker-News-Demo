<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import NewsLoader from './NewsLoader.vue'
import type { Show } from '@/types/Show'
import { countComment, timeDifference } from '@/utils'

// set props
interface Props {
  id: number
}
const props = withDefaults(defineProps<Props>(), {
  id: NaN,
})

const emit = defineEmits(['kids'])

const { data: show, isPending } = useQuery<Show>({
  queryKey: ['jobItem', props.id],
  queryFn: async () => {
    const resp = await axios.get((`https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`))
    return resp.data
  },
  enabled: !!props.id,
  staleTime: 300000,
})
</script>

<template>
  <NewsLoader v-if="isPending" />
  <div v-else-if="show" class="border-b-2 card-layout">
    <div class="flex justify-center items-center w-12 sm:w-20 p-5">
      <p class="text-center font-semibold text-[#f3621d] text-sm sm:text-xl">
        {{ show.score }}
      </p>
    </div>
    <div class="flex flex-col justify-center sm:overflow-hidden sm:truncate my-4 sm:my-0">
      <div class="flex items-center font-mono space-x-1">
        <a
          :href="show.url" target="_blank"
          class="text-sm  sm:text-base sm:truncate  font-medium hover:decoration-orange-500 hover:underline"
        >
          {{ show.title }}
        </a>
      </div>
      <div class="flex text-xs sm:text-sm text-slate-500  ">
        <router-link :to="`/user/${show.by}`">
          by <span class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500">{{ show.by }}</span>
        </router-link>
        <p class="px-1 sm:px-4">
          |
        </p>
        <router-link :to="`/show/${id}`">
          <p class="underline sm:no-underline sm:hover:underline hover:decoration-orange-500">
            {{ countComment(show.kids) }}
          </p>
        </router-link>
        <p class="px-1 sm:px-4">
          |
        </p>
        <p><span class="hidden sm:inline">created</span> {{ timeDifference(show.time) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-layout{
  display: grid;
  grid-template-columns: 1fr 11fr;
}
</style>
