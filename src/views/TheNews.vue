<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import NewsLoader from '@/components/loader/NewsLoader.vue'
import { getNews } from '@/query/news'

const NewsItems = defineAsyncComponent(
  () => import('@/components/news/NewsItems.vue'),
)
const JobItem = defineAsyncComponent(
  () => import('@/components/news/JobItem.vue'),
)
const ShowItem = defineAsyncComponent(
  () => import('@/components/news/ShowItem.vue'),
)
const AskItem = defineAsyncComponent(
  () => import('@/components/news/AskItem.vue'),
)
const IconNext = defineAsyncComponent(
  () => import('@/components/icons/Next.vue'),
)
const IconPrevious = defineAsyncComponent(
  () => import('@/components/icons/Previous.vue'),
)
const EmptyNews = defineAsyncComponent(
  () => import('@/components/EmptyNews.vue'),
)

const route = useRoute()
const newsType = computed(() =>
  Array.isArray(route.params.type)
    ? route.params.type[0]
    : route.params.type || 'top',
)

const { data, isPending } = getNews(newsType)

const currentPage = ref(1)
const totalPage = computed(() => {
  const totalNews = data.value?.length ?? 1
  if (totalNews % 20 === 0) return totalNews / 20
  else return Math.floor(totalNews / 20) + 1
})

const filteredNews = computed(() => {
  const fst = (currentPage.value - 1) * 20
  const lst = currentPage.value * 20 - 1

  return (
    data.value?.filter((val, idx) => {
      if (idx <= lst && idx >= fst) return true
      else return false
    }) || []
  )
})

const isNewsEmpty = computed(() => {
  if (filteredNews.value?.length > 0) return false
  else return true
})

const onNextClick = () => {
  if (currentPage.value !== totalPage.value) currentPage.value += 1
}

const onPreviousClick = () => {
  if (currentPage.value !== 1) currentPage.value -= 1
}
</script>

<template>
  <div class="flex flex-col bg-white h-full w-full">
    <template v-if="isPending">
      <div v-for="n in 20" :key="n" class="flex-grow">
        <NewsLoader :id="n" />
      </div>
    </template>
    <template v-else-if="data">
      <div v-for="n in filteredNews" :key="n" class="flex-grow">
        <JobItem v-if="newsType === 'jobs'" :id="n" />
        <ShowItem v-else-if="newsType === 'show'" :id="n" />
        <AskItem v-else-if="newsType === 'ask'" :id="n" />
        <NewsItems v-else :id="n" />
      </div>
      <div v-if="isNewsEmpty" class="flex-grow">
        <EmptyNews />
      </div>
      <div
        class="flex justify-center items-center text-center my-2 py-2 space-x-3"
      >
        <button :disabled="currentPage === 1" @click="onPreviousClick">
          <IconPrevious :width="20" />
        </button>
        <p>{{ currentPage }}/{{ totalPage }}</p>
        <button :disabled="currentPage === totalPage" @click="onNextClick">
          <IconNext :width="20" />
        </button>
      </div>
    </template>
    <div v-else>
      <p>Something went wrong</p>
    </div>
  </div>
</template>
