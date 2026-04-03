<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { initMarkdownWorldview } from 'markdown-worldview/client'

const { Layout } = DefaultTheme
const route = useRoute()

let cleanup: (() => void) | null = null

// 组件挂载时初始化图表
onMounted(async () => {
  // 等待 DOM 和 CSS 都完全渲染
  await nextTick()
  // 再等待一个短暂的延迟确保样式已应用
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ debug: true })
  }, 100)
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})

// 监听路由变化，重新初始化图表
watch(() => route.path, async () => {
  // 路由变化时，先清理旧图表
  if (cleanup) {
    cleanup()
  }
  // 等待新页面渲染完成
  await nextTick()
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ debug: true })
  }, 100)
})
</script>

<template>
  <Layout />
</template>
