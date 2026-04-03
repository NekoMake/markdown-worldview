/**
 * 组件注册表和渲染器
 * 
 * 管理所有组件渲染器，并为从 YAML 数据渲染组件
 * 提供统一的接口。
 */

import type { MarkdownWorldviewOptions } from '../adapters/navigation';
import { parseYAML, YAMLParseError } from '../parser/yaml-parser';

// Phase 3 组件（纯 CSS）
import { renderCard } from './card';
import { renderNumerical } from './numerical';
import { renderInventory } from './inventory';

// Phase 4 组件（ECharts）
import { renderRadar } from './radar';
import { renderPower } from './power';

/**
 * 组件渲染器函数类型
 */
export type ComponentRenderer = (
  content: string,
  options: Required<MarkdownWorldviewOptions>
) => string;

/**
 * 组件注册表
 */
class ComponentRegistry {
  private renderers: Map<string, ComponentRenderer> = new Map();

  /**
   * 注册一个组件渲染器
   */
  register(name: string, renderer: ComponentRenderer): void {
    this.renderers.set(name, renderer);
  }

  /**
   * 检查组件是否已注册
   */
  has(name: string): boolean {
    return this.renderers.has(name);
  }

  /**
   * 获取组件渲染器
   */
  get(name: string): ComponentRenderer | undefined {
    return this.renderers.get(name);
  }

  /**
   * 渲染一个组件
   */
  render(
    name: string,
    content: string,
    options: Required<MarkdownWorldviewOptions>
  ): string {
    const renderer = this.get(name);
    
    if (!renderer) {
      return this.renderError(
        `Unknown component type: ${name}`,
        options.debug
      );
    }

    try {
      return renderer(content, options);
    } catch (error) {
      if (options.debug) {
        console.error(`[MarkdownWorldview] Error rendering ${name}:`, error);
      }
      
      const message = error instanceof YAMLParseError
        ? error.message
        : `渲染 ${name} 组件失败`;
      
      return this.renderError(message, options.debug);
    }
  }

  /**
   * 渲染错误消息
   */
  private renderError(message: string, debug: boolean): string {
    if (!debug) {
      return ''; // 在生产模式隐藏错误
    }

    return `
      <div class="mw-error" style="
        border: 2px solid #dc2626;
        background: #fee;
        color: #dc2626;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9rem;
      ">
        <strong>⚠️ MarkdownWorldview 错误：</strong><br>
        ${message}
      </div>
    `;
  }

  /**
   * 获取所有已注册的组件名称
   */
  getComponentNames(): string[] {
    return Array.from(this.renderers.keys());
  }
}

/**
 * 全局组件注册表实例
 */
export const componentRegistry = new ComponentRegistry();

/**
 * 注册所有组件渲染器
 */

// Phase 3 组件（纯 CSS）- 已实现
componentRegistry.register('card', renderCard);
componentRegistry.register('numerical', renderNumerical);
componentRegistry.register('inventory', renderInventory);

// Phase 4 组件（ECharts）- 已实现
componentRegistry.register('radar', renderRadar);
componentRegistry.register('power', renderPower);

// Phase 5 组件（Mermaid & Vis-timeline）
componentRegistry.register('relations', (content, options) => {
  const data = parseYAML(content, 'relations');
  return `<div class="${options.classPrefix}-relations">
    <p>🚧 Relations 组件 (Phase 5)</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </div>`;
});

componentRegistry.register('hierarchy', (content, options) => {
  const data = parseYAML(content, 'hierarchy');
  return `<div class="${options.classPrefix}-hierarchy">
    <p>🚧 Hierarchy 组件 (Phase 5)</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </div>`;
});

componentRegistry.register('timeline', (content, options) => {
  const data = parseYAML(content, 'timeline');
  return `<div class="${options.classPrefix}-timeline">
    <p>🚧 Timeline 组件 (Phase 5)</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  </div>`;
});
