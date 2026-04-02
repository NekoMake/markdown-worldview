/**
 * Numerical Component Renderer
 * 
 * 渲染数值面板（进度条、HP条等）
 */

import { parseYAML, validateRequiredFields, escapeHtml, validateFieldType } from '../parser/yaml-parser';
import type { MarkdownWorldviewOptions } from '../adapters/navigation';

/**
 * Numerical 单项数据接口
 */
export interface NumericalItem {
  label: string;        // 标签（如"生命值"）
  value: number;        // 当前值
  max?: number;         // 最大值（可选，有则显示进度条）
  icon?: string;        // 图标（可选，支持 emoji）
}

/**
 * Numerical 组件数据接口
 */
export interface NumericalData {
  title?: string;               // 可选：标题
  items: NumericalItem[];      // 必填：数值项列表
}

/**
 * 渲染 Numerical 组件
 * 
 * @param content - YAML 内容字符串
 * @param options - 插件选项
 * @returns HTML 字符串
 */
export function renderNumerical(content: string, options: MarkdownWorldviewOptions): string {
  try {
    // 解析 YAML
    const data = parseYAML<NumericalData>(content, 'numerical');
    
    // 验证必填字段
    validateRequiredFields(data as unknown as Record<string, unknown>, ['items'], 'numerical');
    validateFieldType(data as unknown as Record<string, unknown>, 'items', 'array', 'numerical');
    
    // 安全处理数据
    const title = data.title ? escapeHtml(data.title) : null;
    const items = data.items || [];
    
    if (items.length === 0) {
      throw new Error('items 数组不能为空');
    }
    
    // 构建 HTML
    let html = '<div class="mw-numerical">';
    
    // 标题（如果有）
    if (title) {
      html += `<h3 class="mw-numerical-title">${title}</h3>`;
    }
    
    // 渲染每个数值项
    for (const item of data.items) {
      // 验证每个 item 的必填字段 - 跳过无效项而不是抛出错误
      if (!item.label || typeof item.value !== 'number') {
        if (options.debug) {
          console.warn('[numerical] 跳过无效项:', item);
        }
        continue;
      }
      
      const label = escapeHtml(String(item.label));
      const value = Number(item.value);
      const max = item.max !== undefined ? Number(item.max) : null;
      const icon = item.icon ? escapeHtml(item.icon) : null;
      
      // 计算进度百分比
      const progress = max ? Math.min(100, Math.max(0, (value / max) * 100)) : null;
      
      html += '<div class="mw-numerical-item">';
      
      // 图标（如果有）
      if (icon) {
        html += `<span class="mw-numerical-icon">${icon}</span>`;
      }
      
      // 内容区域
      html += '<div class="mw-numerical-content">';
      
      // 标签
      html += `<span class="mw-numerical-label">${label}</span>`;
      
      // 进度条（如果有 max）
      if (max !== null && progress !== null) {
        html += `<div class="mw-numerical-bar" style="--progress: ${progress.toFixed(2)}"></div>`;
      }
      
      // 数值显示
      if (max !== null) {
        html += `<span class="mw-numerical-value">${value} / ${max}</span>`;
      } else {
        html += `<span class="mw-numerical-value">${value}</span>`;
      }
      
      html += '</div>'; // .mw-numerical-content
      html += '</div>'; // .mw-numerical-item
    }
    
    html += '</div>'; // .mw-numerical
    
    return html;
  } catch (error) {
    // 错误处理
    if (options.debug) {
      return `
<div class="mw-numerical mw-error">
  <p><strong>Numerical 组件错误:</strong> ${escapeHtml(String(error))}</p>
  <pre>${escapeHtml(content)}</pre>
</div>`;
    }
    return ''; // 生产模式下静默失败
  }
}
