/**
 * Radar Component Renderer (服务端渲染器)
 * 
 * 渲染雷达图组件的 HTML 容器，包含图表配置数据。
 * 实际的图表由客户端 ECharts 渲染。
 */

import { parseYAML, validateRequiredFields, escapeHtml } from '../parser/yaml-parser';
import type { MarkdownWorldviewOptions } from '../adapters/navigation';

/**
 * Radar 组件数据接口
 */
export interface RadarData {
  title?: string;                    // 可选：标题
  data: Record<string, number>;      // 必填：雷达图数据（维度名: 数值）
}

/**
 * 渲染 Radar 组件
 * 
 * @param content - YAML 内容字符串
 * @param options - 插件选项
 * @returns HTML 字符串
 */
export function renderRadar(content: string, options: MarkdownWorldviewOptions): string {
  try {
    // 解析 YAML
    const data = parseYAML<RadarData>(content, 'radar');
    
    // 验证必填字段
    validateRequiredFields(data as unknown as Record<string, unknown>, ['data'], 'radar');
    
    // 验证 data 是否为对象
    if (typeof data.data !== 'object' || data.data === null || Array.isArray(data.data)) {
      throw new Error('Radar component: "data" must be an object');
    }
    
    // 验证所有值是否为数字
    for (const [key, value] of Object.entries(data.data)) {
      if (typeof value !== 'number') {
        throw new Error(`Radar component: value for "${key}" must be a number, got ${typeof value}`);
      }
      if (value < 0 || value > 100) {
        throw new Error(`Radar component: value for "${key}" must be between 0 and 100, got ${value}`);
      }
    }
    
    // 安全处理标题
    const title = data.title ? escapeHtml(data.title) : '';
    
    // 将配置序列化为 JSON（供客户端使用）
    const configJson = JSON.stringify({
      title,
      data: data.data
    });
    
    // 转义 JSON 中的引号以便安全嵌入 HTML 属性
    const configJsonEscaped = configJson
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
    
    // 构建 HTML 容器
    // 客户端会扫描 [data-mw-chart-type] 元素并初始化图表
    const html = `
<div 
  class="mw-radar mw-chart mw-chart-radar"
  data-mw-chart-type="radar"
  data-mw-chart-config="${configJsonEscaped}"
  style="height: 400px; width: 100%;"
>
  <div class="mw-chart-loading">加载中...</div>
</div>`.trim();
    
    return html;
    
  } catch (error) {
    // 错误处理
    if (options.debug) {
      const message = error instanceof Error ? error.message : String(error);
      return `
<div class="mw-error">
  <strong>Radar 组件渲染错误</strong>
  <pre>${escapeHtml(message)}</pre>
</div>`.trim();
    }
    
    // 生产模式静默失败
    return '';
  }
}
