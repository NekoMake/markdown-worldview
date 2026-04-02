/**
 * 导航适配器接口
 * 
 * 为处理组件链接点击提供回调机制。
 * 宿主应用程序（Obsidian、Logseq、VitePress 等）应提供
 * onNavigate 函数的实现。
 */

/**
 * 导航事件数据
 */
export interface NavigationEvent {
  /**
   * 要导航到的目标路径
   * @example "/wiki/elena" 或 "/factions/winter"
   */
  path: string;

  /**
   * 触发导航的源元素
   */
  sourceElement?: HTMLElement;

  /**
   * 附加元数据（可选）
   */
  metadata?: Record<string, unknown>;
}

/**
 * 导航回调函数类型
 */
export type NavigateFunction = (event: NavigationEvent) => void;

/**
 * 插件选项接口
 */
export interface MarkdownWorldviewOptions {
  /**
   * 导航回调函数
   * 
   * 当用户点击带有链接的组件时，将调用此函数。
   * 宿主应用程序应实现此函数以处理页面导航。
   * 
   * @example
   * // 在 Obsidian 中
   * onNavigate: (event) => {
   *   this.app.workspace.openLinkText(event.path, '', false);
   * }
   * 
   * @example
   * // 在 VitePress 中使用 Vue Router
   * onNavigate: (event) => {
   *   router.push(event.path);
   * }
   */
  onNavigate?: NavigateFunction;

  /**
   * 启用调试模式（在控制台输出警告和错误）
   * @default false
   */
  debug?: boolean;

  /**
   * 所有组件的自定义类名前缀
   * @default "mw"
   */
  classPrefix?: string;
}

/**
 * 默认选项
 */
export const defaultOptions: Required<MarkdownWorldviewOptions> = {
  onNavigate: (event) => {
    console.warn(
      'MarkdownWorldview: 未提供 onNavigate 函数。' +
      `无法导航到: ${event.path}`
    );
  },
  debug: false,
  classPrefix: 'mw',
};

/**
 * 合并用户选项与默认选项
 */
export function mergeOptions(
  userOptions?: MarkdownWorldviewOptions
): Required<MarkdownWorldviewOptions> {
  return {
    ...defaultOptions,
    ...userOptions,
  };
}

/**
 * 为给定的链接创建导航处理器
 */
export function createNavigationHandler(
  path: string,
  onNavigate: NavigateFunction
): (event: MouseEvent) => void {
  return (event: MouseEvent) => {
    event.preventDefault();
    
    onNavigate({
      path,
      sourceElement: event.currentTarget as HTMLElement,
    });
  };
}
