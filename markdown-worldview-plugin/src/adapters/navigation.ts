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
 * 服务端插件配置接口
 * 
 * 用于 markdown-it 插件（服务端渲染）。
 * 服务端只负责将 YAML 渲染成 HTML，不处理用户交互。
 */
export interface PluginOptions {
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
 * 默认插件选项
 */
export const defaultPluginOptions: Required<PluginOptions> = {
  debug: false,
  classPrefix: 'mw',
};

/**
 * 合并用户选项与默认选项
 */
export function mergePluginOptions(
  userOptions?: PluginOptions
): Required<PluginOptions> {
  return {
    ...defaultPluginOptions,
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
