<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import NewsLoader from '@/components/loader/NewsLoader.vue'
import { useQuery } from '@tanstack/vue-query'

const NewsItems = defineAsyncComponent(
  () => import('@/components/news/NewsItems.vue'),
)
const ShowItem = defineAsyncComponent(
  () => import('@/components/news/ShowItem.vue'),
)
const AskItem = defineAsyncComponent(
  () => import('../components/news/AskItem.vue'),
)
const CommentsCom = defineAsyncComponent(
  () => import('@/components/CommentsCom.vue'),
)

const route = useRoute()
const newid = computed(() => {
  const id = route.params.newsid
  const numID = Number(id)
  return numID
})

const detailsPageType = computed(() => {
  if (route.path.includes('/ask/')) return 'ask'
  else if (route.path.includes('/show/')) return 'show'
  else return 'news'
})

const newsType = Array.isArray(route.params.type)
  ? route.params.type[0]
  : route.params.type || 'top'

const { data, isPending } = useQuery<{ kids: Array<number> }>({
  queryKey: [newsType, newid],
})

const text = ref('')
const setText = (val: string) => {
  text.value = val
}
</script>

<template>
  <div class="space-y-2">
    <div class="bg-white">
      <ShowItem v-if="detailsPageType === 'show'" :id="newid" />
      <div v-else-if="detailsPageType === 'ask'">
        <AskItem :id="newid" @text="setText" />
        <div class="text-xs text-slate-600 p-5" v-html="text" />
      </div>
      <NewsItems v-else :id="newid" />
    </div>
    <div>
      <NewsLoader v-if="isPending" />
      <template v-else-if="data">
        <div v-for="kid in data.kids" :key="kid" class="space-y-10">
          <CommentsCom :id="kid" />
        </div>
      </template>
      <div v-else>
        <p>Something went wrong</p>
      </div>
    </div>
  </div>
</template>
