<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useHeadMetaData } from './composables/meta'
import FooterCom from '@/components/FooterCom.vue'
import NavbarCom from '@/components/NavbarCom.vue'

useHeadMetaData()
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center">
    <NavbarCom />
    <div class="font-mono bg-slate-200  flex-grow">
      <div class="container mx-auto max-w-5xl">
        <RouterView />
      </div>
    </div>
    <FooterCom />
  </div>
  <VueQueryDevtools />
</template>
