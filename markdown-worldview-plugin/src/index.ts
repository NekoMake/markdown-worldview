/**
 * Markdown-Worldview 插件
 * 
 * 一个用于渲染交互式世界观组件的 markdown-it 插件。
 */

import './styles/index.css';
import type MarkdownIt from 'markdown-it';
import type { PluginOptions } from './adapters/navigation';
import { mergePluginOptions } from './adapters/navigation';
import { componentRegistry } from './components/registry';

/**
 * Markdown-it 插件函数
 * 
 * @param md - MarkdownIt 实例
 * @param userOptions - 插件选项（服务端配置）
 * 
 * @example
 * ```typescript
 * import MarkdownIt from 'markdown-it';
 * import { markdownWorldviewPlugin } from 'markdown-worldview';
 * 
 * const md = new MarkdownIt();
 * md.use(markdownWorldviewPlugin, {
 *   debug: true  // 服务端只需要 debug 选项
 * });
 * ```
 */
export function markdownWorldviewPlugin(
  md: MarkdownIt,
  userOptions?: PluginOptions
): void {
  const options = mergePluginOptions(userOptions);

  // 获取所有已注册的组件名称
  const componentNames = componentRegistry.getComponentNames();

  // 覆盖 fence 渲染器以处理我们的组件
  const originalFence = md.renderer.rules.fence || function(tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = (tokens, idx, renderOptions, _env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();
    const componentType = info.split(/\s+/)[0]; // 获取第一个单词（组件名称）

    // 检查是否是我们的组件
    if (componentNames.includes(componentType)) {
      const content = token.content;
      return componentRegistry.render(componentType, content, options);
    }

    // 不是我们的组件，使用原始渲染器
    return originalFence(tokens, idx, renderOptions, _env, self);
  };

  if (options.debug) {
    console.log('[MarkdownWorldview] Plugin initialized with components:', componentNames);
  }
}

/**
 * 导出所有类型和工具函数
 */
export type {
  PluginOptions,
  NavigationEvent,
  NavigateFunction,
} from './adapters/navigation';

export { YAMLParseError } from './parser/yaml-parser';
export { componentRegistry } from './components/registry';

/**
 * 导出客户端工具函数
 */
export {
  setupNavigationHandlers,
  createAutoNavigationHandler,
} from './client/navigation';
