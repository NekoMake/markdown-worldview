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
 * 渲染单个数值项
 * 
 * @param item - 数值项数据
 * @param hasProgress - 是否有进度条
 * @returns HTML 字符串
 */
function renderNumericalItem(item: NumericalItem, hasProgress: boolean): string {
  const label = escapeHtml(String(item.label));
  const value = Number(item.value);
  const max = item.max !== undefined ? Number(item.max) : null;
  const icon = item.icon ? escapeHtml(item.icon) : null;
  
  // 计算进度百分比
  const progress = max ? Math.min(100, Math.max(0, (value / max) * 100)) : null;
  
  // 根据是否有进度条选择不同的类名
  const itemClass = hasProgress ? 'mw-numerical-item mw-numerical-item--progress' : 'mw-numerical-item mw-numerical-item--simple';
  
  let html = `<div class="${itemClass}">`;
  
  // 图标（如果有）
  if (icon) {
    html += `<span class="mw-numerical-icon">${icon}</span>`;
  }
  
  // 内容区域（只有带进度条的需要）
  if (hasProgress) {
    html += '<div class="mw-numerical-content">';
    
    // 标签
    html += `<span class="mw-numerical-label">${label}</span>`;
    
    // 进度条
    if (max !== null && progress !== null) {
      html += `<div class="mw-numerical-bar" style="--progress: ${progress.toFixed(2)}"></div>`;
    }
    
    // 数值显示
    html += `<span class="mw-numerical-value">${value} / ${max}</span>`;
    
    html += '</div>'; // .mw-numerical-content
  } else {
    // 不带进度条的简单布局
    html += '<div class="mw-numerical-content">';
    
    // 标签
    html += `<span class="mw-numerical-label">${label}</span>`;
    
    // 数字用带背景的矩形包裹
    html += `<span class="mw-numerical-value-large">${value}</span>`;
    
    html += '</div>'; // .mw-numerical-content
  }
  
  html += '</div>'; // .mw-numerical-item
  
  return html;
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
    
    // 将 items 按是否有进度条分组
    const itemsWithProgress: NumericalItem[] = [];
    const itemsSimple: NumericalItem[] = [];
    
    for (const item of data.items) {
      // 验证每个 item 的必填字段 - 跳过无效项而不是抛出错误
      if (!item.label || typeof item.value !== 'number') {
        if (options.debug) {
          console.warn('[numerical] 跳过无效项:', item);
        }
        continue;
      }
      
      // 根据是否有 max 来分组
      if (item.max !== undefined) {
        itemsWithProgress.push(item);
      } else {
        itemsSimple.push(item);
      }
    }
    
    // 构建 HTML
    let html = '<div class="mw-numerical">';
    
    // 标题（如果有）
    if (title) {
      html += `<h3 class="mw-numerical-title">${title}</h3>`;
    }
    
    // 渲染带进度条的项（第一行）
    if (itemsWithProgress.length > 0) {
      for (const item of itemsWithProgress) {
        html += renderNumericalItem(item, true);
      }
    }
    
    // 在两组之间添加强制换行（如果两组都存在）
    if (itemsWithProgress.length > 0 && itemsSimple.length > 0) {
      html += '<div class="mw-numerical-break"></div>';
    }
    
    // 渲染不带进度条的项（第二行）
    if (itemsSimple.length > 0) {
      for (const item of itemsSimple) {
        html += renderNumericalItem(item, false);
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
