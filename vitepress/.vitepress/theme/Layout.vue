<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { initMarkdownWorldview } from 'markdown-worldview/client'

const { Layout } = DefaultTheme
const route = useRoute()
const router = useRouter()

let cleanup: (() => void) | null = null

// 组件挂载时初始化图表和导航
onMounted(async () => {
  // 等待 DOM 和 CSS 都完全渲染
  await nextTick()
  // 再等待一个短暂的延迟确保样式已应用
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        // 客户端处理导航跳转
        router.go(event.path)
      }
    })
  }, 100)
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})

// 监听路由变化，重新初始化图表和导航
watch(() => route.path, async () => {
  // 路由变化时，先清理旧资源
  if (cleanup) {
    cleanup()
  }
  // 等待新页面渲染完成
  await nextTick()
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        // 客户端处理导航跳转
        router.go(event.path)
      }
    })
  }, 100)
})
</script>

<template>
  <Layout />
</template>
