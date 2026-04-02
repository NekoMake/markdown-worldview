/**
 * 客户端导航处理工具
 * 
 * 提供浏览器端的事件委托，用于处理组件的点击导航
 */

import type { NavigateFunction, NavigationEvent } from '../adapters/navigation';

/**
 * 设置导航事件处理器
 * 
 * 在浏览器端调用此函数来为所有带 `data-mw-link` 属性的元素
 * 设置点击事件委托。
 * 
 * @param containerElement - 容器元素（默认为 document.body）
 * @param onNavigate - 导航回调函数
 * @param options - 配置选项
 * 
 * @example
 * ```typescript
 * import { setupNavigationHandlers } from 'markdown-worldview';
 * 
 * // 在页面加载后调用
 * setupNavigationHandlers(document.body, (event) => {
 *   console.log('导航到:', event.path);
 *   // 使用你的路由系统进行导航
 *   router.push(event.path);
 * });
 * ```
 */
export function setupNavigationHandlers(
  containerElement: HTMLElement = document.body,
  onNavigate?: NavigateFunction,
  options?: {
    /** 是否阻止默认行为（默认为 true） */
    preventDefault?: boolean;
    /** 是否在控制台输出调试信息 */
    debug?: boolean;
  }
): () => void {
  const { preventDefault = true, debug = false } = options || {};

  // 事件处理函数
  const handleClick = (event: MouseEvent) => {
    // 查找最近的带 data-mw-link 属性的祖先元素
    const target = (event.target as HTMLElement).closest('[data-mw-link]') as HTMLElement;
    
    if (!target) {
      return;
    }

    const link = target.getAttribute('data-mw-link');
    
    if (!link) {
      return;
    }

    // 阻止默认行为（如果需要）
    if (preventDefault) {
      event.preventDefault();
    }

    // 构建导航事件
    const navigationEvent: NavigationEvent = {
      path: link,
      sourceElement: target,
    };

    // 调用导航回调
    if (typeof onNavigate === 'function') {
      if (debug) {
        console.log('[MarkdownWorldview] 导航到:', link);
      }
      onNavigate(navigationEvent);
    } else {
      console.warn(
        '[MarkdownWorldview] 未提供 onNavigate 回调函数。' +
        '点击的链接将不会触发导航：' + link
      );
    }
  };

  // 添加事件委托
  containerElement.addEventListener('click', handleClick);

  if (debug) {
    console.log('[MarkdownWorldview] 导航处理器已设置在:', containerElement);
  }

  // 返回清理函数
  return () => {
    containerElement.removeEventListener('click', handleClick);
    if (debug) {
      console.log('[MarkdownWorldview] 导航处理器已移除');
    }
  };
}

/**
 * 创建一个自动管理的导航处理器
 * 
 * 这个函数会在 DOM 加载完成后自动设置导航处理器，
 * 并在页面卸载时自动清理。
 * 
 * @param onNavigate - 导航回调函数
 * @param options - 配置选项
 * 
 * @example
 * ```typescript
 * import { createAutoNavigationHandler } from 'markdown-worldview';
 * 
 * createAutoNavigationHandler((event) => {
 *   router.push(event.path);
 * });
 * ```
 */
export function createAutoNavigationHandler(
  onNavigate: NavigateFunction,
  options?: {
    preventDefault?: boolean;
    debug?: boolean;
  }
): void {
  if (typeof window === 'undefined') {
    console.warn('[MarkdownWorldview] createAutoNavigationHandler 只能在浏览器环境中使用');
    return;
  }

  let cleanup: (() => void) | null = null;

  const setup = () => {
    cleanup = setupNavigationHandlers(document.body, onNavigate, options);
  };

  // 如果 DOM 已经加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    if (cleanup) {
      cleanup();
    }
  });
}
