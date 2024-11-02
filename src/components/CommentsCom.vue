<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Comment } from '@/types/Comment'
import { timeDifference } from '@/utils/time'
import NewsLoader from '@/components/loader/NewsLoader.vue'
import CommentsCom from '@/components/CommentsCom.vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'

const props = withDefaults(defineProps<{ id: number }>(), {
  id: NaN,
})

const { data, isPending } = useQuery<Comment>({
  queryKey: ['comments', props.id],
  queryFn: async () => {
    const resp = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`,
    )
    return resp.data
  },
})

const ttlComment = computed(() => {
  const childCommnet = data.value?.kids?.length || 0
  return childCommnet + 1
})

const commnetData = computed(() => {
  return data.value?.text || 'No comment availabe'
})

const showReply = ref(false)

const kids = computed(() => {
  return data.value?.kids || []
})
</script>

<template>
  <NewsLoader v-if="isPending" />
  <div v-else-if="data" class="bg-white px-5 pt-5 pb-2 text-sm">
    <p class="mb-2 border-b">
      <RouterLink :to="`/user/${data.by || '-'}`">
        <span class="hover:underline text-orange-600">{{
          data.by || '-'
        }}</span>
      </RouterLink>
      | {{ timeDifference(data.time) }} |
      <span>{{ ttlComment }} Comment</span>
    </p>
    <div class="text-xs text-slate-600" v-html="commnetData" />
    <div
      v-if="ttlComment > 1"
      class="text-xs text-orange-600 pt-2 cursor-pointer hover:underline"
    >
      <p v-if="showReply" @click="showReply = !showReply">Hide Comment [-]</p>
      <p v-else @click="showReply = !showReply">
        Show Reply {{ ttlComment }} [+]
      </p>
    </div>
    <div class="ml-2" v-if="showReply">
      <div v-for="kid in kids" :key="kid" class="space-y-10">
        <CommentsCom :id="kid" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>Something went wrong</p>
  </div>
</template>
