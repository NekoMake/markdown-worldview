/**
 * Markdown-Worldview 客户端初始化函数
 * 
 * 提供统一的客户端初始化接口，只负责需要 DOM API 的功能：
 * - 图表初始化（ECharts）
 * - 响应式调整
 * - 未来可能的客户端增强功能
 * 
 * 注意：导航处理（onNavigate）应该在服务端配置时设置，不是这个函数的责任。
 */

import { echartsManager } from './echarts-manager';

/**
 * 初始化选项
 */
export interface InitOptions {
  /** 调试模式（显示详细日志） */
  debug?: boolean;
}

/**
 * 初始化 Markdown-Worldview 客户端功能
 * 
 * 这个函数只负责初始化需要客户端 DOM API 的功能：
 * 1. 扫描页面并初始化所有图表（ECharts）
 * 2. 自动处理响应式调整（ResizeObserver）
 * 3. 未来可能的客户端增强功能（动画、懒加载等）
 * 
 * **重要**：导航处理（onNavigate）应该在 markdown-it 插件配置时设置，
 * 而不是在这里配置。客户端的 `initMarkdownWorldview()` 只负责图表等
 * 需要浏览器 API 的功能。
 * 
 * @param options - 初始化选项
 * @returns 清理函数，用于销毁所有图表实例和清理资源
 * 
 * @example
 * ```typescript
 * // 在 VitePress 主题的 enhanceApp 中调用
 * import { initMarkdownWorldview } from 'markdown-worldview/client';
 * 
 * export default {
 *   async enhanceApp({ app, router }) {
 *     if (typeof window !== 'undefined') {
 *       const cleanup = await initMarkdownWorldview({ debug: true });
 *       
 *       // SPA 路由切换时清理旧图表
 *       router.onBeforeRouteChange = () => {
 *         cleanup();
 *       };
 *       
 *       // 路由切换后重新初始化
 *       router.onAfterRouteChanged = async () => {
 *         await initMarkdownWorldview({ debug: true });
 *       };
 *     }
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // 在普通网页中使用
 * import { initMarkdownWorldview } from 'markdown-worldview/client';
 * 
 * // 页面加载后初始化
 * document.addEventListener('DOMContentLoaded', async () => {
 *   const cleanup = await initMarkdownWorldview({ debug: true });
 *   
 *   // 页面卸载时清理（可选）
 *   window.addEventListener('beforeunload', cleanup);
 * });
 * ```
 */
export async function initMarkdownWorldview(options?: InitOptions): Promise<() => void> {
  const { debug = false } = options || {};
  
  console.log('[MarkdownWorldview] 🚀 开始初始化 Markdown-Worldview 客户端', options);
  console.log('[MarkdownWorldview] 当前 window 对象:', typeof window !== 'undefined' ? '存在' : '不存在');
  console.log('[MarkdownWorldview] 当前 document 对象:', typeof document !== 'undefined' ? '存在' : '不存在');
  
  try {
    // 初始化所有图表
    console.log('[MarkdownWorldview] 调用 echartsManager.initializePageCharts()...');
    await echartsManager.initializePageCharts();
    
    if (debug) {
      console.log('[MarkdownWorldview] ✅ Charts initialized successfully');
    }
  } catch (error) {
    console.error('[MarkdownWorldview] ❌ Failed to initialize charts:', error);
    console.error('[MarkdownWorldview] 错误堆栈:', error instanceof Error ? error.stack : error);
    if (debug) {
      console.error('[MarkdownWorldview] Debug mode - 详细错误信息:', error);
    }
    // 即使初始化失败，也返回清理函数（防止内存泄漏）
  }
  
  // 返回清理函数
  return () => {
    if (debug) {
      console.log('[MarkdownWorldview] Cleaning up resources...');
    }
    echartsManager.destroyAll();
  };
}

// 重新导出其他客户端工具（供高级用户使用）
export { echartsManager } from './echarts-manager';
export { buildRadarConfig, buildPowerConfig } from './chart-configs';
