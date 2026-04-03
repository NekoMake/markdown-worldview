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
    
    // 分组：先收集有进度条的项和无进度条的项
    const progressItems: Array<{label: string; value: number; max: number; icon: string | null; progress: number}> = [];
    const simpleItems: Array<{label: string; value: number; icon: string | null}> = [];
    
    for (const item of data.items) {
      // 验证每个 item 的必填字段 - 跳过无效项
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
      
      if (max !== null) {
        // 有进度条的项
        const progress = Math.min(100, Math.max(0, (value / max) * 100));
        progressItems.push({ label, value, max, icon, progress });
      } else {
        // 无进度条的项
        simpleItems.push({ label, value, icon });
      }
    }
    
    // 渲染有进度条的卡片（如果有）
    if (progressItems.length > 0) {
      for (const item of progressItems) {
        html += '<div class="mw-numerical-item mw-numerical-item--progress">';
        
        // 图标（可选）
        if (item.icon) {
          html += `<span class="mw-numerical-icon">${item.icon}</span>`;
        }
        
        // 内容区域
        html += '<div class="mw-numerical-content">';
        html += `<div class="mw-numerical-label">${item.label}</div>`;
        html += `<div class="mw-numerical-bar" style="--progress: ${item.progress.toFixed(2)}"></div>`;
        html += `<div class="mw-numerical-value">${item.value} / ${item.max}</div>`;
        html += '</div>'; // .mw-numerical-content
        
        html += '</div>'; // .mw-numerical-item
      }
    }
    
    // 渲染无进度条的卡片（如果有）
    if (simpleItems.length > 0) {
      for (const item of simpleItems) {
        html += '<div class="mw-numerical-item mw-numerical-item--simple">';
        
        // 图标（可选，在右上角）
        if (item.icon) {
          html += `<span class="mw-numerical-icon">${item.icon}</span>`;
        }
        
        // 大数值
        html += `<div class="mw-numerical-value-large">${item.value}</div>`;
        
        // 标签
        html += `<div class="mw-numerical-label">${item.label}</div>`;
        
        html += '</div>'; // .mw-numerical-item
      }
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
