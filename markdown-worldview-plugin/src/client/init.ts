/**
 * Markdown-Worldview 客户端初始化函数
 * 
 * 提供统一的客户端初始化接口，负责需要 DOM API 的功能：
 * - 图表初始化（ECharts）
 * - 导航事件处理（点击跳转）
 * - 响应式调整
 * - 未来可能的客户端增强功能
 */

import { echartsManager } from './echarts-manager';
import { setupNavigationHandlers } from './navigation';
import type { NavigateFunction } from '../adapters/navigation';

/**
 * 客户端初始化选项
 * 
 * 用于浏览器端的功能初始化（图表、导航等）
 */
export interface ClientInitOptions {
  /** 调试模式（显示详细日志） */
  debug?: boolean;
  
  /** 
   * 导航回调函数
   * 
   * 当用户点击带有链接的组件时调用。
   * 这是客户端唯一需要配置导航的地方。
   * 
   * @example
   * // VitePress 中
   * onNavigate: (event) => {
   *   router.go(event.path)
   * }
   * 
   * @example
   * // 普通网页中
   * onNavigate: (event) => {
   *   window.location.href = event.path
   * }
   */
  onNavigate?: NavigateFunction;
}

/**
 * 初始化 Markdown-Worldview 客户端功能
 * 
 * 这个函数负责初始化所有需要客户端 DOM API 的功能：
 * 1. 扫描页面并初始化所有图表（ECharts）
 * 2. 设置导航事件处理器（处理组件点击跳转）
 * 3. 自动处理响应式调整（ResizeObserver）
 * 4. 未来可能的客户端增强功能（动画、懒加载等）
 * 
 * @param options - 初始化选项
 * @returns 清理函数，用于销毁所有图表实例和清理资源
 * 
 * @example
 * ```typescript
 * // 在 VitePress 主题的 Layout.vue 中调用
 * import { initMarkdownWorldview } from 'markdown-worldview/client';
 * import { useRouter } from 'vitepress';
 * 
 * const router = useRouter();
 * const cleanup = await initMarkdownWorldview({ 
 *   debug: true,
 *   onNavigate: (event) => {
 *     router.go(event.path)
 *   }
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // 在普通网页中使用
 * import { initMarkdownWorldview } from 'markdown-worldview/client';
 * 
 * document.addEventListener('DOMContentLoaded', async () => {
 *   const cleanup = await initMarkdownWorldview({ 
 *     debug: true,
 *     onNavigate: (event) => {
 *       window.location.href = event.path
 *     }
 *   });
 *   
 *   window.addEventListener('beforeunload', cleanup);
 * });
 * ```
 */
export async function initMarkdownWorldview(options?: ClientInitOptions): Promise<() => void> {
  const { debug = false, onNavigate } = options || {};
  
  if (debug) {
    console.log('[MarkdownWorldview] 🚀 初始化客户端功能');
  }
  
  try {
    // 1. 初始化所有图表
    await echartsManager.initializePageCharts();
    
    if (debug) {
      console.log('[MarkdownWorldview] ✅ 图表初始化成功');
    }
  } catch (error) {
    console.error('[MarkdownWorldview] ❌ 图表初始化失败:', error);
    if (debug && error instanceof Error) {
      console.error('[MarkdownWorldview] 错误堆栈:', error.stack);
    }
  }
  
  // 2. 设置导航处理器（如果提供了 onNavigate）
  let cleanupNav: (() => void) | null = null;
  if (onNavigate) {
    if (debug) {
      console.log('[MarkdownWorldview] ⚙️ 设置导航事件处理器');
    }
    cleanupNav = setupNavigationHandlers(document.body, onNavigate, {
      preventDefault: true,
      debug,
    });
  } else if (debug) {
    console.warn('[MarkdownWorldview] ⚠️ 未提供 onNavigate，组件链接将无法跳转');
  }
  
  // 3. 返回清理函数
  return () => {
    if (debug) {
      console.log('[MarkdownWorldview] 🧹 清理资源');
    }
    echartsManager.destroyAll();
    if (cleanupNav) {
      cleanupNav();
    }
  };
}

// 重新导出其他客户端工具（供高级用户使用）
export { echartsManager } from './echarts-manager';
export { buildRadarConfig, buildPowerConfig } from './chart-configs';
export { setupNavigationHandlers, createAutoNavigationHandler } from './navigation';

// 重新导出类型（供用户使用）
export type { NavigateFunction, NavigationEvent } from '../adapters/navigation';
