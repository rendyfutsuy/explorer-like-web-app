<template>
  <div class="virtual" :style="{ height: height + 'px' }" @scroll="onScroll" ref="container">
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        v-for="(item, i) in visibleItems"
        :key="start + i"
        :style="{
          position: 'absolute',
          top: (start + i) * itemHeight + 'px',
          height: itemHeight + 'px',
          left: 0, right: 0
        }"
      >
        <slot :item="item" :index="start + i" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  items: any[]
  itemHeight: number
  height: number
}>()

const container = ref<HTMLDivElement | null>(null)
const start = ref(0)
const end = ref(0)
const totalHeight = computed(() => props.items.length * props.itemHeight)
const visibleCount = computed(() => Math.ceil(props.height / props.itemHeight) + 2)
const visibleItems = computed(() => props.items.slice(start.value, Math.min(props.items.length, end.value)))

function onScroll() {
  const top = container.value?.scrollTop ?? 0
  start.value = Math.max(0, Math.floor(top / props.itemHeight) - 1)
  end.value = Math.min(props.items.length, start.value + visibleCount.value)
}

onScroll()
</script>

<style scoped>
.virtual { overflow: auto; }
</style>
